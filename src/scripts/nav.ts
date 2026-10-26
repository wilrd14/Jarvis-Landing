/**
 * Cabecera: menú móvil, fondo al hacer scroll y resaltado de la sección visible.
 * Se conecta al DOM solo con data-nav-toggle, data-nav-panel y data-nav-link
 * (+ data-nav-sections). Sin JS la página sigue funcionando (enlaces visibles).
 */

const MOBILE_QUERY = '(max-width: 767.98px)';
const SCROLL_THRESHOLD = 8;

/** Abre o cierra el panel actualizando el estado que lee el CSS. */
function setOpen(header: HTMLElement, toggle: HTMLButtonElement, open: boolean): void {
  header.dataset.nav = open ? 'open' : 'closed';
  toggle.setAttribute('aria-expanded', String(open));
  const label = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
  if (label) toggle.setAttribute('aria-label', label);
}

function initMenu(header: HTMLElement, toggle: HTMLButtonElement, panel: HTMLElement): void {
  setOpen(header, toggle, false);
  const isOpen = (): boolean => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(header, toggle, !isOpen()));

  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(header, toggle, false);
      toggle.focus();
    }
  });

  panel.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      setOpen(header, toggle, false);
    }
  });

  // Al pasar a escritorio el panel siempre se ve; se deja el estado coherente.
  if (typeof window.matchMedia === 'function') {
    window.matchMedia(MOBILE_QUERY).addEventListener('change', (query) => {
      if (!query.matches) setOpen(header, toggle, false);
    });
  }
}

function initScrollState(header: HTMLElement): void {
  const update = (): void => {
    header.toggleAttribute('data-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initCurrentLink(links: HTMLAnchorElement[]): void {
  if (typeof IntersectionObserver === 'undefined') return;

  const sectionToLink = new Map<Element, HTMLAnchorElement>();
  for (const link of links) {
    const ids = (link.dataset.navSections ?? '').split(' ').filter(Boolean);
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) sectionToLink.set(section, link);
    }
  }

  const visible = new Set<Element>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      // Gana la sección visible que aparece antes en el documento.
      const current = [...visible].sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      )[0];
      const active = current ? sectionToLink.get(current) : undefined;
      for (const link of links) {
        if (link === active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    },
    // Banda estrecha cerca del tercio superior de la ventana
    { rootMargin: '-30% 0px -60% 0px' },
  );
  sectionToLink.forEach((_link, section) => observer.observe(section));
}

function init(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-nav-panel]');
  const header = toggle?.closest('header');
  if (!toggle || !panel || !header) return;

  initMenu(header, toggle, panel);
  initScrollState(header);
  initCurrentLink([...panel.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')]);
}

init();
