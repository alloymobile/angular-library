/**
 * PLRA Admin Layout config (Angular)
 * Same idea as Next.js: admin.json drives the layout via CSS classNames.
 *
 * - Keep "topbar" in navBarAction.className so the layout CSS can fix-position it.
 * - Keep sidebar links using "sidebar-link d-flex flex-column align-items-center fs-6"
 *   so the rail styling works automatically.
 */
export const PLRA_ADMIN_LAYOUT = {
  sideBar: {
    close: "plraAdminSidebar",
    categories: [
      {
        id: "plraMain",
        type: "TdLinkIcon",
        className: "d-grid g-0 p-0 list-unstyled",
        selected: "active",
        linkClass: "",
        title: { id: "plraTitle", name: "", className: "mb-3 text-uppercase text-muted fw-semibold small" },
        links: [
          { id: "linkDashboard", name: "Dashboard", href: "/plra/admin", className: "sidebar-link d-flex flex-column align-items-center fs-6", icon: { iconClass: "fa-solid fa-gauge-high" } },
          { id: "linkRates", name: "Rates", href: "/plra/admin/rates", className: "sidebar-link d-flex flex-column align-items-center fs-6", icon: { iconClass: "fa-solid fa-chart-line" } },
          { id: "linkCategories", name: "Category", href: "/plra/admin/category", className: "sidebar-link d-flex flex-column align-items-center fs-6", icon: { iconClass: "fa-solid fa-layer-group" } },
          { id: "linkProducts", name: "Product", href: "/plra/admin/product", className: "sidebar-link d-flex flex-column align-items-center fs-6", icon: { iconClass: "fa-solid fa-box" } },
          { id: "linkCvp", name: "CVP", href: "/plra/admin/cvp", className: "sidebar-link d-flex flex-column align-items-center fs-6", icon: { iconClass: "fa-solid fa-tags" } },
        ],
      },
    ],
  },

  navBarAction: {
    id: "plra-admin-topbar",
    className: "navbar navbar-expand-lg topbar border-bottom",
    containerClass: "container-fluid",
    collapseId: "plraTopbarCollapse",
    logo: {
      href: "/plra/admin",
      logo: "https://files.precastxchange.com/PRECASTXCHANGE/logo/precastxchange-logo.png",
      name: "",
      width: 96,
      height: "auto",
      logoAlt: "PLRA",
      className: "navbar-brand d-flex align-items-center m-0 p-0",
    },
    linkBar: {
      type: "TdLinkIcon",
      className: "navbar-nav me-auto",
      selected: "active",
      linkClass: "nav-link",
      links: [],
    },
    buttonBar: {
      id: "plraTopActions",
      className: "d-flex align-items-center gap-2",
      buttons: [
        { id: "topNotif", name: "", type: "button", className: "btn btn-sm dropdown-toggle", icon: { iconClass: "fa-regular fa-bell" } },
        { id: "topMsg", name: "", type: "button", className: "btn btn-sm dropdown-toggle", icon: { iconClass: "fa-regular fa-envelope" } },
        { id: "topAccount", name: "Account", type: "button", className: "btn btn-sm dropdown-toggle d-inline-flex align-items-center gap-2", icon: { iconClass: "fa-regular fa-user" } },
      ],
    },
  },
} as const;
