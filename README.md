# Personal Wealth · v1.0.0

Statická česká aplikace pro osobní finance, navazující na vzhled FILIP CRM: font Fustat, modrošedé barvy, světlé průsvitné karty, zaoblené ovládání a horní navigace.

## První spuštění

1. Otevřete `index.html` v prohlížeči. Není potřeba instalace ani server.
2. V **Import a zálohy** vyberte samostatně dodaný `personal-wealth-initial.private.json`, zkontrolujte počty a potvrďte načtení.
3. V Dashboardu rozbalte poznámky ke zdrojovým datům. Aktualizujte chybějící hodnoty a starší ocenění.
4. Pravidelně stahujte **Zálohu dat**. Data jsou uložena v localStorage daného prohlížeče a adresy, nikoli automaticky v souboru na disku.

GitHub verze začíná prázdná. Vlastní data do ní načtěte stejným soukromým JSON souborem. Zdrojové výpisy ani soukromá data nepatří do repozitáře. Aplikace nemá analytiku, CDN, síťové požadavky ani přihlašování. Data v prohlížeči a JSON zálohy nejsou šifrované.

## Co funguje

- Dashboard, cashflow po měsících, graf a tabulka historie.
- Přidání, editace a mazání majetku, investic, dluhů a účtů (v CZK). Prázdná hodnota je neznámá, nula je skutečná nula.
- Ruční editace všech transakcí včetně účtu, data, částky, kategorie, protiúčtu, poznámky a přepnutí interního převodu.
- Rozpoznání převodů podle registru vlastních účtů. Párování jednoznačné protistrany stejné částky a měny v intervalu tří dní. Částka samotná není důkazem vlastního převodu.
- Pravidla kategorií, ruční override, hledání a filtrování.
- Lokální ukládání, validovaná obnova zálohy, import normalizovaných transakcí s deduplikací ID.
- Uložení/editace historických stavů. Editace dnešních položek nemění minulost.

Zůstatky účtů jsou samostatná ocenění. Úprava/import transakcí je automaticky nepřepočítává. Souhrnný účet a jeho dílčí účty nesmí být současně zahrnuté do majetku. Datumy jednotlivých ocenění se mohou lišit; dashboard ukazuje poslední známé hodnoty, nikoli rozvahu ke společnému datu. Investiční vklady a splátky se ve v1 počítají do odchozího cashflow.

## PDF a budoucí CRM

V1 obsahuje funkční frontu PDF metadat a rozhraní pro bankovní adaptéry, **nikoli obecný parser PDF nebo OCR**. Další výpis tedy sám nevytvoří transakce. Původní přiložené výpisy jsou jednorázově převedené a ověřené v soukromém importu. Fronta neukládá samotné PDF.

CRM synchronizace není implementovaná. Rezervované objekty pro klientské AUM a očekávané provize jsou oddělené od osobního majetku. Podrobnosti v `docs/ARCHITECTURE.md`.

## Vývoj a nasazení

Node.js 22+, bez závislostí:

```sh
npm test
npm run build
```

GitHub Pages publikuje pouze povolené soubory z `dist/`, nikdy celý pracovní adresář. Workflow je v `.github/workflows/pages.yml`. Nastavení repozitáře: **Settings → Pages → Source → GitHub Actions**. Po nahrání větve `main` se aplikace nasadí. Lze spustit také ručně z větve `main`. Tagy slouží k označení vydání; nasazení používá povolenou větev `main`.

Repozitář: https://github.com/filipsolar202-blip/personal-wealth

Aplikace: https://filipsolar202-blip.github.io/personal-wealth/

Vydání: https://github.com/filipsolar202-blip/personal-wealth/releases/tag/v1.0.0

## Vydávání verzí

Používáme SemVer a samostatnou verzi datového schématu. Před vydáním aktualizujte `VERSION`, `package.json`, `src/domain.js`, odznak `index.html` a `CHANGELOG.md`. Spusťte testy, ověřte import zálohy a aktualizaci existujícího úložiště. Commit označte tagem `vMAJOR.MINOR.PATCH`. Data ukládejte pod stabilním klíčem; při změně schématu přidejte explicitní migraci a test staré zálohy. Neprovádějte tichý reset.

Font Fustat je převzat z místní instalace CRM, licence v `assets/Fustat-OFL.txt`. Ostatní kód vznikl pro tento projekt.
