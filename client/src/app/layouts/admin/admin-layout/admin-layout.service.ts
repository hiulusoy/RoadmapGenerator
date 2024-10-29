import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import SimpleBar from 'simplebar'; // SimpleBar import

declare let window: any; // Global window nesnesi
declare let FilePond: any;
declare let FilePondPluginImagePreview: any;

@Injectable({
  providedIn: 'root'
})
export class AdminLayoutService {
  private renderer: Renderer2;
  private config: any;
  private defaultConfig: any;
  private htmlElement: HTMLElement;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Default configuration for the layout
    this.defaultConfig = {
      theme: 'dark',
      leftbar: {
        hide: false,
        type: 'full',
      },
    };

    // Load configuration from localStorage if available
    const configCache = localStorage.getItem('__NEXUS__HTML__ADMIN__LAYOUT__');
    this.config = configCache ? JSON.parse(configCache) : this.defaultConfig;
    this.htmlElement = document.querySelector('html') as HTMLElement;
    window.themeConfig = this.config;
    this.updateTheme();
  }

  updateTheme() {
    localStorage.setItem('__NEXUS__HTML__ADMIN__LAYOUT__', JSON.stringify(this.config));
    if (this.config.theme === 'dark') {
      this.renderer.addClass(this.htmlElement, 'dark');
    } else {
      this.renderer.removeClass(this.htmlElement, 'dark');
    }
    this.renderer.setAttribute(this.htmlElement, 'data-theme', this.config.theme);
    if (this.config.leftbar.hide) {
      this.renderer.setAttribute(this.htmlElement, 'data-leftbar-hide', '');
    } else {
      this.renderer.removeAttribute(this.htmlElement, 'data-leftbar-hide');
    }
    this.renderer.setAttribute(this.htmlElement, 'data-leftbar-type', this.config.leftbar.type);
  }

  notifyLayoutChanges() {
    const themeEvent = new Event('custom.layout-changed');
    document.dispatchEvent(themeEvent);
  }

  initEventListener() {
    const themeToggleBtn = document.querySelectorAll('[data-action=theme-toggle]');
    themeToggleBtn.forEach((toggle: Element) => {
      toggle.addEventListener('click', () => {
        this.config.theme = this.config.theme === 'light' ? 'dark' : 'light';
        this.updateTheme();
        this.notifyLayoutChanges();
      });
    });
  }

  initLeftmenu() {
    this.initLeftmenuHandler();
    this.initMenuResizer();
    this.initLeftbarBackdrop();
    this.initMenuActivation();
    this.scrollToActiveMenu();
  }

  initLeftmenuHandler() {
    const leftbarToggle = document.querySelector('[data-action=leftbar-toggle]');
    if (leftbarToggle) {
      leftbarToggle.addEventListener('click', () => {
        this.config.leftbar.hide = !this.config.leftbar.hide;
        this.updateTheme();
      });
    }
  }

  initMenuResizer() {
    const resizeFn = () => {
      this.config.leftbar.type = window.innerWidth < 1023 ? 'mobile' : 'full';
      this.config.leftbar.hide = this.config.leftbar.type === 'mobile';
      this.updateTheme();
    };
    window.addEventListener('resize', resizeFn);
    resizeFn();
  }

  initLeftbarBackdrop() {
    const leftbarToggle = document.querySelector('.leftbar-backdrop');
    if (leftbarToggle) {
      leftbarToggle.addEventListener('click', () => {
        this.config.leftbar.hide = true;
        this.updateTheme();
      });
    }
  }

  initMenuActivation() {
    const menuItems = document.querySelectorAll('.leftmenu-wrapper .menu a');
    let currentURL = window.location.href;
    if (window.location.pathname === '/') {
      currentURL += 'dashboards-ecommerce';
    }
    menuItems.forEach((item) => {
      const anchorItem = item as HTMLAnchorElement;
      if (anchorItem.href === currentURL) {
        this.renderer.addClass(anchorItem, 'active');
        const detailEl = anchorItem.parentElement?.parentElement?.parentElement;
        if (detailEl && detailEl.tagName.toLowerCase() === 'details') {
          this.renderer.setAttribute(detailEl, 'open', '');
        }
        const detailEl2 = detailEl?.parentElement?.parentElement?.parentElement;
        if (detailEl2 && detailEl2.tagName.toLowerCase() === 'details') {
          this.renderer.setAttribute(detailEl2, 'open', '');
        }
      }
    });
  }

  scrollToActiveMenu() {
    const simplebarEl = document.querySelector('.leftmenu-wrapper [data-simplebar]') as HTMLElement;
    const activatedItem = document.querySelector('.leftmenu-wrapper .menu a.active');
    if (simplebarEl && activatedItem) {
      const simplebar = new SimpleBar(simplebarEl);
      const top = activatedItem.getBoundingClientRect().top;
      if (top && top !== 0) {
        simplebar.getScrollElement().scrollTo({
          top: top - 300,
          behavior: 'smooth'
        });
      }
    }
  }

  initFileUpload() {
    if (window.FilePond) {
      if (window.FilePondPluginImagePreview) {
        FilePond.registerPlugin(FilePondPluginImagePreview);
      }

      document.querySelectorAll('[data-component=filepond]').forEach((fp) => {
        window.FilePond.create(fp, {
          credits: false
        });
      });
    }
  }

  initSelectChoices() {
    if (window.Choices) {
      if (document.querySelector('[data-choice]')) {
        new window.Choices('[data-choice]', { allowHTML: true });
      }
    }
  }

  afterInit() {
    this.initEventListener();
    this.initLeftmenu();
  }

  init() {
    this.updateTheme();
    window.addEventListener('DOMContentLoaded', this.afterInit.bind(this));
  }
}
