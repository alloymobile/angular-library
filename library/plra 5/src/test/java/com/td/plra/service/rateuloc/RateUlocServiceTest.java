package com.td.plra.service.rateuloc;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.RateUlocActive;
import com.td.plra.persistence.entity.RateUlocDraft;
import com.td.plra.persistence.entity.RateUlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.RateUlocActiveRepository;
import com.td.plra.persistence.repository.RateUlocDraftRepository;
import com.td.plra.persistence.repository.RateUlocHistoryRepository;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.cvpcode.CvpCodeService;
import com.td.plra.service.rateuloc.binding.RateUlocBinding;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import com.td.plra.service.rateuloc.mapper.RateUlocMapper;
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
class RateUlocServiceTest {

    @Mock private RateUlocActiveRepository activeRepository;
    @Mock private RateUlocDraftRepository draftRepository;
    @Mock private RateUlocHistoryRepository historyRepository;

    @Mock private WorkflowService workflowService;
    @Mock private CvpCodeService cvpCodeService;
    @Mock private AmountTierService amountTierService;

    @Mock private RateUlocMapper mapper;
    @Mock private RateUlocBinding binding;

    @InjectMocks private RateUlocService service;

    @Test
    void createDraft_setsRefs_generatesChangeId_saves_andRecordsWorkflow() {
        RateUlocInput input = RateUlocInput.builder()
                .cvpCodeId(1L)
                .amountTierId(2L)
                .startDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusDays(30))
                .targetRate(new BigDecimal("5.100000"))
                .floorRate(new BigDecimal("4.100000"))
                .detail("d")
                .build();

        CvpCode cvp = new CvpCode();
        cvp.setId(1L);
        AmountTier tier = new AmountTier();
        tier.setId(2L);

        RateUlocDraft draft = new RateUlocDraft();
        RateUlocDraft saved = new RateUlocDraft();
        saved.setId(10L);

        RateUlocAdminView view = RateUlocAdminView.builder().id(10L).build();

        when(cvpCodeService.getEntityById(1L)).thenReturn(cvp);
        when(amountTierService.getEntityById(2L)).thenReturn(tier);

        when(mapper.inputToDraft(input)).thenReturn(draft);
        when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(saved);
        when(mapper.draftToAdminView(saved)).thenReturn(view);

        RateUlocAdminView out = service.createDraft(input);

        assertEquals(10L, out.getId());

        verify(workflowService).recordTransition(eq(RateType.ULOC), eq(10L), eq(WorkflowAction.CREATE), isNull(), eq(RateStatus.DRAFT));
        verify(draftRepository).save(argThat(d -> d.getCvpCode() == cvp && d.getAmountTier() == tier && d.getChangeId() != null));
    }

    @Test
    void findAllByCvpCodeAndAmountTier_mergesAndSortsByCreatedOnDesc() {
        RateUlocDraft d = new RateUlocDraft();
        RateUlocActive a = new RateUlocActive();
        RateUlocHistory h = new RateUlocHistory();

        RateUlocAdminView dv = RateUlocAdminView.builder().id(1L).createdOn(LocalDateTime.now().minusDays(1)).build();
        RateUlocAdminView av = RateUlocAdminView.builder().id(2L).createdOn(LocalDateTime.now()).build();
        RateUlocAdminView hv = RateUlocAdminView.builder().id(3L).createdOn(LocalDateTime.now().minusDays(2)).build();

        when(draftRepository.findByCvpCodeIdAndAmountTierIdAndActive(1L, 2L, ActiveStatus.Y)).thenReturn(List.of(d));
        when(activeRepository.findByCvpCodeIdAndAmountTierIdAndActive(1L, 2L, ActiveStatus.Y)).thenReturn(List.of(a));
        when(historyRepository.findByCvpCodeIdAndAmountTierId(eq(1L), eq(2L), any(Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of(h)));

        when(mapper.draftToAdminView(d)).thenReturn(dv);
        when(mapper.activeToAdminView(a)).thenReturn(av);
        when(mapper.historyToAdminView(h)).thenReturn(hv);

        List<RateUlocAdminView> out = service.findAllByCvpCodeAndAmountTier(1L, 2L);

        assertEquals(List.of(2L, 1L, 3L), out.stream().map(RateUlocAdminView::getId).toList());
    }
}
