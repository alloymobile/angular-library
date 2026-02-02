package com.td.plra.service.rateiloc;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.RateIlocActive;
import com.td.plra.persistence.entity.RateIlocDraft;
import com.td.plra.persistence.entity.RateIlocHistory;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.RateIlocActiveRepository;
import com.td.plra.persistence.repository.RateIlocDraftRepository;
import com.td.plra.persistence.repository.RateIlocHistoryRepository;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.rateiloc.binding.RateIlocBinding;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
import com.td.plra.service.rateiloc.mapper.RateIlocMapper;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.workflow.WorkflowService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateIlocServiceTest {

    @Mock private RateIlocActiveRepository activeRepository;
    @Mock private RateIlocDraftRepository draftRepository;
    @Mock private RateIlocHistoryRepository historyRepository;

    @Mock private WorkflowService workflowService;
    @Mock private AmountTierService amountTierService;
    @Mock private SubCategoryService subCategoryService;

    @Mock private RateIlocMapper mapper;
    @Mock private RateIlocBinding binding;

    @InjectMocks private RateIlocService service;

    @Test
    void createDraft_setsRefs_generatesChangeId_saves_andRecordsWorkflow() {
        RateIlocInput input = RateIlocInput.builder()
                .amountTierId(1L)
                .subCategoryId(2L)
                .startDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusDays(30))
                .targetRate(new BigDecimal("4.100000"))
                .floorRate(new BigDecimal("3.100000"))
                .detail("d")
                .build();

        AmountTier tier = new AmountTier();
        tier.setId(1L);
        SubCategory sub = new SubCategory();
        sub.setId(2L);

        RateIlocDraft draft = new RateIlocDraft();
        RateIlocDraft saved = new RateIlocDraft();
        saved.setId(10L);

        RateIlocAdminView view = RateIlocAdminView.builder().id(10L).build();

        when(amountTierService.getEntityById(1L)).thenReturn(tier);
        when(subCategoryService.getEntityById(2L)).thenReturn(sub);

        when(mapper.inputToDraft(input)).thenReturn(draft);
        when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(saved);
        when(mapper.draftToAdminView(saved)).thenReturn(view);

        RateIlocAdminView out = service.createDraft(input);

        assertEquals(10L, out.getId());

        verify(workflowService).recordTransition(eq(RateType.ILOC), eq(10L), eq(WorkflowAction.CREATE), isNull(), eq(RateStatus.DRAFT));
        verify(draftRepository).save(argThat(d -> d.getAmountTier() == tier && d.getSubCategory() == sub && d.getChangeId() != null));
    }

    @Test
    void findAllByAmountTierAndSubCategory_mergesAndSortsByCreatedOnDesc() {
        RateIlocDraft d = new RateIlocDraft();
        RateIlocActive a = new RateIlocActive();
        RateIlocHistory h = new RateIlocHistory();

        RateIlocAdminView dv = RateIlocAdminView.builder().id(1L).createdOn(LocalDateTime.now().minusDays(1)).build();
        RateIlocAdminView av = RateIlocAdminView.builder().id(2L).createdOn(LocalDateTime.now()).build();
        RateIlocAdminView hv = RateIlocAdminView.builder().id(3L).createdOn(LocalDateTime.now().minusDays(2)).build();

        when(draftRepository.findByAmountTierIdAndSubCategoryIdAndActive(1L, 2L, ActiveStatus.Y)).thenReturn(List.of(d));
        when(activeRepository.findByAmountTierIdAndSubCategoryIdAndActive(1L, 2L, ActiveStatus.Y)).thenReturn(List.of(a));
        when(historyRepository.findByAmountTierIdAndSubCategoryId(eq(1L), eq(2L), any(Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of(h)));

        when(mapper.draftToAdminView(d)).thenReturn(dv);
        when(mapper.activeToAdminView(a)).thenReturn(av);
        when(mapper.historyToAdminView(h)).thenReturn(hv);

        List<RateIlocAdminView> out = service.findAllByAmountTierAndSubCategory(1L, 2L);

        assertEquals(List.of(2L, 1L, 3L), out.stream().map(RateIlocAdminView::getId).toList());
    }
}
