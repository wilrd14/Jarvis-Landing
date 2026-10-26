import { describe, expect, it } from 'vitest';
import { SITE } from '@/data/site';
import { NAV_ITEMS, NAV_LABELS, FOOTER_LABELS } from '@/data/nav';
import { HERO } from '@/data/hero';
import { VOICE } from '@/data/voice';
import { INSTANT } from '@/data/instant';
import { ACTIONS_SECTION, ACTION_GROUPS, SCREEN_FEATURE, CONFIRM_MOCKUP } from '@/data/actions';
import {
  DOCUMENTS_SECTION,
  DOCUMENT_FORMATS,
  DOCUMENT_POINTS,
  COST_MOCKUP,
} from '@/data/documents';
import { SKILLS_HEADING, SKILLS_COLUMN, MEMORY_COLUMN } from '@/data/skills';
import { MOBILE_HEADING, MOBILE_STEPS, MOBILE_PRIVACY, MOBILE_NOTICE } from '@/data/mobile';
import { SECURITY_HEADING, SECURITY_ITEMS } from '@/data/security';
import { COSTS_HEADING, COST_BLOCKS } from '@/data/costs';
import { INSTALL } from '@/data/install';
import { FAQ } from '@/data/faq';
import { AUTHOR, FINAL_CTA } from '@/data/author';
import {
  collectIcons,
  collectStrings,
  expectNoEmptyStrings,
  ICON_NAMES,
  sectionIds,
  EXPECTED_ANCHORS,
} from './helpers';

const ALL = {
  SITE,
  NAV_ITEMS,
  NAV_LABELS,
  FOOTER_LABELS,
  HERO,
  VOICE,
  INSTANT,
  ACTIONS_SECTION,
  ACTION_GROUPS,
  SCREEN_FEATURE,
  CONFIRM_MOCKUP,
  DOCUMENTS_SECTION,
  DOCUMENT_FORMATS,
  DOCUMENT_POINTS,
  COST_MOCKUP,
  SKILLS_HEADING,
  SKILLS_COLUMN,
  MEMORY_COLUMN,
  MOBILE_HEADING,
  MOBILE_STEPS,
  MOBILE_PRIVACY,
  MOBILE_NOTICE,
  SECURITY_HEADING,
  SECURITY_ITEMS,
  COSTS_HEADING,
  COST_BLOCKS,
  INSTALL,
  FAQ,
  AUTHOR,
  FINAL_CTA,
};

describe('site.ts', () => {
  it('tiene textos no vacíos y lang es', () => {
    expectNoEmptyStrings(SITE);
    expect(SITE.lang).toBe('es');
  });
  it('githubUrl y portfolioUrl son URLs https válidas', () => {
    for (const u of [SITE.githubUrl, SITE.portfolioUrl]) {
      const url = new URL(u);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).not.toBe('');
    }
  });
  it('el autor coincide con el README', () => {
    expect(SITE.author).toBe('Williams Villavizar');
  });
});

describe('nav.ts', () => {
  it('textos no vacíos', () => {
    expectNoEmptyStrings({ NAV_ITEMS, NAV_LABELS, FOOTER_LABELS });
  });
  it('los href son anclas internas que existen en las secciones', () => {
    const ids = sectionIds();
    expect(NAV_ITEMS.length).toBeGreaterThan(0);
    for (const item of NAV_ITEMS) {
      expect(item.href).toMatch(/^#[a-z]+$/);
      expect(ids, `ancla ${item.href}`).toContain(item.href.slice(1));
      for (const m of item.matches ?? []) expect(ids, `matches ${m}`).toContain(m);
    }
  });
  it('no hay href duplicados', () => {
    const hrefs = NAV_ITEMS.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
  it('las secciones reales cubren todas las anclas esperadas', () => {
    const ids = sectionIds();
    for (const a of EXPECTED_ANCHORS) expect(ids).toContain(a);
  });
});

describe('hero.ts', () => {
  it('textos no vacíos y CTAs válidos', () => {
    expectNoEmptyStrings(HERO);
    expect(HERO.primaryCta.href).toBe(SITE.githubUrl);
    expect(HERO.secondaryCta.href).toBe('#instalacion');
    expect(sectionIds()).toContain(HERO.secondaryCta.href.slice(1));
  });
  it('tiene etiquetas', () => {
    expect(HERO.tags.length).toBeGreaterThan(0);
  });
});

describe('voice.ts', () => {
  it('tiene exactamente 4 puntos (RF-02)', () => {
    expect(VOICE.points).toHaveLength(4);
  });
  it('textos no vacíos', () => expectNoEmptyStrings(VOICE));
});

describe('instant.ts', () => {
  it('tiene exactamente 8 órdenes (RF-03)', () => {
    expect(INSTANT.commands).toHaveLength(8);
  });
  it('etiquetas únicas y textos no vacíos', () => {
    expectNoEmptyStrings(INSTANT);
    const labels = INSTANT.commands.map((c) => c.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe('actions.ts', () => {
  it('tiene grupos con elementos', () => {
    expect(ACTION_GROUPS.length).toBeGreaterThan(0);
    for (const g of ACTION_GROUPS) expect(g.items.length).toBeGreaterThan(0);
  });
  it('textos no vacíos', () => {
    expectNoEmptyStrings({ ACTIONS_SECTION, ACTION_GROUPS, SCREEN_FEATURE, CONFIRM_MOCKUP });
  });
});

describe('documents.ts', () => {
  it('tiene exactamente 8 formatos únicos (RF-05)', () => {
    const labels = DOCUMENT_FORMATS.map((f) => f.label);
    expect(labels).toHaveLength(8);
    expect(new Set(labels).size).toBe(8);
    expect(labels).toEqual(
      expect.arrayContaining([
        'Word',
        'PDF',
        'Excel',
        'PowerPoint',
        'Markdown',
        'HTML',
        'Texto',
        'CSV',
      ]),
    );
  });
  it('textos no vacíos', () => {
    expectNoEmptyStrings({ DOCUMENTS_SECTION, DOCUMENT_FORMATS, DOCUMENT_POINTS, COST_MOCKUP });
  });
  it('la carpeta de destino es Documentos\\Jarvis', () => {
    expect(DOCUMENT_POINTS.folder.path).toBe('Documentos\\Jarvis');
  });
});

describe('skills.ts', () => {
  it('lista exactamente 7 skills únicas (RF-06)', () => {
    expect(SKILLS_COLUMN.items).toHaveLength(7);
    expect(new Set(SKILLS_COLUMN.items).size).toBe(7);
  });
  it('la descripción cita la cifra 7 de forma coherente', () => {
    expect(SKILLS_COLUMN.description).toMatch(/\b7\b/);
  });
  it('la memoria tiene exactamente 2 propiedades', () => {
    expect(MEMORY_COLUMN.properties).toHaveLength(2);
  });
  it('textos no vacíos', () =>
    expectNoEmptyStrings({ SKILLS_HEADING, SKILLS_COLUMN, MEMORY_COLUMN }));
});

describe('mobile.ts', () => {
  it('tiene exactamente 3 pasos (RF-07)', () => {
    expect(MOBILE_STEPS).toHaveLength(3);
  });
  it('textos no vacíos', () => {
    expectNoEmptyStrings({ MOBILE_HEADING, MOBILE_STEPS, MOBILE_PRIVACY, MOBILE_NOTICE });
    expect(MOBILE_NOTICE.items.length).toBeGreaterThan(0);
  });
});

describe('security.ts', () => {
  it('tiene exactamente 6 garantías (RF-08)', () => {
    expect(SECURITY_ITEMS).toHaveLength(6);
  });
  it('cada garantía tiene frase clara y técnica', () => {
    expectNoEmptyStrings({ SECURITY_HEADING, SECURITY_ITEMS });
  });
});

describe('costs.ts', () => {
  it('tiene exactamente 3 bloques (RF-09)', () => {
    expect(COST_BLOCKS).toHaveLength(3);
  });
  it('textos no vacíos', () => expectNoEmptyStrings({ COSTS_HEADING, COST_BLOCKS }));
});

describe('install.ts', () => {
  const commands = [
    ...INSTALL.steps.flatMap((s) => s.commands ?? []),
    ...INSTALL.autostart.commands,
  ];
  it('contiene exactamente los 4 comandos del README', () => {
    expect(commands).toEqual([
      'npm install',
      'npm run app:install',
      'npm run app:autostart:on',
      'npm run app:autostart:off',
    ]);
  });
  it('tiene al menos un paso y textos no vacíos', () => {
    expect(INSTALL.steps.length).toBeGreaterThan(0);
    expectNoEmptyStrings(INSTALL);
  });
  it('los comandos no tienen espacios sobrantes ni saltos de línea', () => {
    for (const c of commands) {
      expect(c).toBe(c.trim());
      expect(c).not.toMatch(/[\r\n]/);
    }
  });
});

describe('faq.ts', () => {
  it('tiene al menos 6 preguntas (RF-14)', () => {
    expect(FAQ.items.length).toBeGreaterThanOrEqual(6);
  });
  it('preguntas únicas con signos y respuestas no vacías', () => {
    expectNoEmptyStrings(FAQ);
    const qs = FAQ.items.map((i) => i.question);
    expect(new Set(qs).size).toBe(qs.length);
    for (const q of qs) expect(q).toMatch(/^¿.*\?$/);
  });
  it('cubre los temas obligatorios del PRD', () => {
    const qs = FAQ.items.map((i) => i.question).join(' | ');
    for (const t of [/internet/i, /cuesta/i, /Mac|Linux/i, /datos/i, /OpenRouter/i, /skills/i]) {
      expect(qs).toMatch(t);
    }
  });
});

describe('author.ts', () => {
  it('textos no vacíos', () => expectNoEmptyStrings({ AUTHOR, FINAL_CTA }));
  it('el CTA final apunta a una ancla existente', () => {
    expect(sectionIds()).toContain(FINAL_CTA.installHref.slice(1));
  });
});

describe('consistencia transversal', () => {
  it('todos los iconos usados existen en ICONS', () => {
    const icons = collectIcons(ALL);
    expect(icons.length).toBeGreaterThan(20);
    for (const i of icons) expect(ICON_NAMES, `icono ${i}`).toContain(i);
  });

  it('los href internos de los datos apuntan a anclas existentes', () => {
    const ids = sectionIds();
    const internal = collectStrings(ALL).filter((s) => /^#[a-z]+$/.test(s));
    expect(internal.length).toBeGreaterThan(0);
    for (const h of internal) expect(ids, h).toContain(h.slice(1));
  });

  it('costs, documents y actions no contienen importes ni monedas', () => {
    const money = /[$€£]|\bUSD\b|\bEUR\b|\bd[óo]lar(es)?\b|\beuros?\b|\bpesos?\b|\bcentavos?\b/i;
    const strings = collectStrings({
      COSTS_HEADING,
      COST_BLOCKS,
      DOCUMENTS_SECTION,
      DOCUMENT_FORMATS,
      DOCUMENT_POINTS,
      COST_MOCKUP,
      ACTIONS_SECTION,
      ACTION_GROUPS,
      SCREEN_FEATURE,
      CONFIRM_MOCKUP,
    });
    for (const s of strings) expect(s, s).not.toMatch(money);
  });

  it('ninguna cadena visible afirma «código abierto» (Q-01 abierta)', () => {
    for (const s of collectStrings(ALL)) {
      expect(s, s).not.toMatch(/c[óo]digo\s+abierto|open[\s-]?source/i);
    }
  });

  it('ninguna cadena contiene marcadores de relleno', () => {
    for (const s of collectStrings(ALL)) {
      expect(s, s).not.toMatch(/lorem|undefined|\[object|\bTODO\b|\bTBD\b/);
    }
  });
});
