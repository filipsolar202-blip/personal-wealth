# Personal Wealth · v1.1.0

Statická česká aplikace pro osobní finance, navazující na vzhled FILIP CRM: font Fustat, modrošedé barvy, světlé průsvitné karty, zaoblené ovládání a horní navigace.

## První spuštění

1. Otevřete [webovou aplikaci](https://filipsolar202-blip.github.io/personal-wealth/) nebo samostatný `Personal-Wealth-v1.1.0.html` z vydání. Pro vývoj modulárního `index.html` použijte lokální HTTP server (`npm start`).
2. V **Import a zálohy → Načíst Excel** vyberte svůj přehled majetku. Náhled ukáže položky a historii, poté klikněte **Importovat majetek a historii**.
3. V **Načíst bankovní výpisy** vyberte PDF z Air Bank a/nebo ČSOB. Po kontrole náhledu potvrďte **Importovat výpis**. Lze vybrat oba soubory najednou. Existující výpisy ze staré fronty verze 1.0 nahrajte znovu; původní soubory nebyly v úložišti uchovány.
4. Pravidelně stahujte **Zálohu dat**. Data jsou uložena v localStorage daného prohlížeče a adresy, nikoli automaticky v souboru na disku.

Na novém prohlížeči začíná aplikace prázdná; aktualizace zachová existující evidenci. Podporuje také obnovu starší JSON zálohy. Soubory se čtou přímo v prohlížeči, neodesílají se na server. Knihovny jsou součástí aplikace bez CDN. Zdrojové výpisy ani soukromá data nepatří do repozitáře. Data v prohlížeči a JSON zálohy nejsou šifrované.

## Co funguje

- Dashboard, cashflow po měsících, graf a tabulka historie.
- Přidání, editace a mazání majetku, investic, dluhů a účtů (v CZK). Prázdná hodnota je neznámá, nula je skutečná nula.
- Ruční editace všech transakcí včetně účtu, data, částky, kategorie, protiúčtu, poznámky a přepnutí interního převodu.
- Rozpoznání převodů podle registru vlastních účtů. Párování jednoznačné protistrany stejné částky a měny v intervalu tří dní. Částka samotná není důkazem vlastního převodu.
- Pravidla kategorií, ruční override, hledání a filtrování.
- Lokální ukládání, validovaná obnova zálohy, import normalizovaných transakcí s deduplikací ID.
- Uložení/editace historických stavů. Editace dnešních položek nemění minulost.
- Přímý import Excelu ve struktuře dodaného přehledu (názvy v prvním sloupci, datované sloupce podle řádku Datum, souhrn Celkem, sekce účtů a dluhů). Zachovává neznámé částky, hlásí neplatná data a porovnává součty.
- Přímý import textových PDF výpisů Air Bank a ČSOB v CZK. Kontroluje příjmy, výdaje a konečný zůstatek; při nesouladu nic neuloží. Založí nebo přiřadí účet a nabídne aktualizaci jeho zůstatku. Opakovaný import zachovává ruční úpravy transakcí.

Zůstatky účtů jsou samostatná ocenění. Import PDF může nastavit konečný bankovní zůstatek; pozdější ruční úprava transakce jej automaticky nemění. Novější zůstatek není přepsán starším výpisem. Souhrn Air Bank z Excelu se nesčítá znovu s dílčími účty. Datumy jednotlivých ocenění se mohou lišit; dashboard ukazuje poslední známé hodnoty, nikoli rozvahu ke společnému datu. Investiční vklady a splátky se počítají do odchozího cashflow.

Excel standardně doplňuje nové položky a historii. Aktualizaci již existujících položek je třeba výslovně zaškrtnout; ani pak se novější ocenění nepřepíše starším. Vlastnictví dalšího protiúčtu se stejným jménem potvrďte v náhledu výpisu. Neoznačujte společný domácí účet, pokud mají příspěvky zůstat ve výdajích.

## Podporované soubory a budoucí CRM

Limit souboru je 20 MB, PDF do 100 stran. Podporované jsou elektronické CZK výpisy Air Bank a ČSOB ve formátu ověřeném dodanými soubory. Skeny/fotografie potřebují OCR, které není součástí této verze; jiné banky a odlišné šablony dostanou srozumitelnou chybu bez částečného importu. Revolut lze evidovat a upravovat ručně, parser jeho PDF zatím není součástí aplikace. Originály PDF a Excelu se neukládají do JSON záloh; ukládají se načtené položky a zdrojové odkazy.

CRM synchronizace není implementovaná. Rezervované objekty pro klientské AUM a očekávané provize jsou oddělené od osobního majetku. Podrobnosti v `docs/ARCHITECTURE.md`.

## Vývoj a nasazení

Node.js 22+, bez instalace balíčků (PDF.js a SheetJS jsou přibalené v `assets/vendor/`):

```sh
npm test
npm run build
```

GitHub Pages publikuje pouze povolené soubory z `dist/`, nikdy celý pracovní adresář. Workflow je v `.github/workflows/pages.yml`. Nastavení repozitáře: **Settings → Pages → Source → GitHub Actions**. Po nahrání větve `main` se aplikace nasadí. Lze spustit také ručně z větve `main`. Tagy slouží k označení vydání; nasazení používá povolenou větev `main`.

Repozitář: https://github.com/filipsolar202-blip/personal-wealth

Aplikace: https://filipsolar202-blip.github.io/personal-wealth/

Vydání: https://github.com/filipsolar202-blip/personal-wealth/releases/tag/v1.1.0

## Vydávání verzí

Používáme SemVer a samostatnou verzi datového schématu. Před vydáním aktualizujte `VERSION`, `package.json`, `src/domain.js`, odznak `index.html` a `CHANGELOG.md`. Spusťte testy, ověřte import zálohy a aktualizaci existujícího úložiště. Commit označte tagem `vMAJOR.MINOR.PATCH`. Data ukládejte pod stabilním klíčem; při změně schématu přidejte explicitní migraci a test staré zálohy. Neprovádějte tichý reset.

Font Fustat je převzat z místní instalace CRM, licence v `assets/Fustat-OFL.txt`. PDF.js a SheetJS mají licence a původ v `assets/vendor/README.md`. Aplikační kód vznikl pro tento projekt.
