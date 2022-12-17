using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Translate_Engine
{
    public class TranslationsFinderArrays
    {
        public static List<string> FindSpanishTranslation(string Word, string PartOfSpeech)
        {
            List<string> TranslationsList = new List<string>();
            Dictionary<string, Array> SpanishPartsOfSpeech = new Dictionary<string, Array>();
            SpanishPartsOfSpeech.Add("verb", new string[] { "Verbo", "Forma_verbal" });
            SpanishPartsOfSpeech.Add("adjective", new string[] { "Adjetivo" });
            SpanishPartsOfSpeech.Add("noun", new string[] { "Sustantivo" });
            SpanishPartsOfSpeech.Add("adverb", new string[] { "Adverbio" });
            SpanishPartsOfSpeech.Add("number", new string[] { "Adjetivo_cardinal", "Adjetivo_ordinal" });
            SpanishPartsOfSpeech.Add("conjunction", new string[] { "Conjunción" });
            SpanishPartsOfSpeech.Add("preposition", new string[] { "Preposición" });
            SpanishPartsOfSpeech.Add("pronoun", new string[]
                { "Adjetivo_posesivo", "Pronombre" });
            SpanishPartsOfSpeech.Add("determiner", new string[]
                { "Adjetivo_posesivo", "Pronombre" });

            HtmlWeb DictionaryWebsite = new HtmlWeb();
            HtmlDocument HTMLDocument = DictionaryWebsite.Load($"https://es.wiktionary.org/wiki/{Word}");
            try
            {
                foreach (string SpanishPartOfSpeech in SpanishPartsOfSpeech[PartOfSpeech])
                {
                    var Translations = HTMLDocument.DocumentNode.SelectNodes($"//span[@class='mw-headline'][@id='Inglés']/parent::h2/following-sibling::h3/span[contains(@id, '{SpanishPartOfSpeech}')][1]/parent::h3/following-sibling::dl[1]/dd");

                    if (Translations == null)
                    {
                        var TranslationsIfPlural = HTMLDocument.DocumentNode.SelectNodes($"//span[@class='mw-headline'][@id='Inglés']/parent::h2/following-sibling::h3/span[contains(@id, 'Forma_sustantiva')][1]/parent::h3/following-sibling::dl[1]/dd");
                        if (TranslationsIfPlural != null)
                        {
                            int LastSpaceIndex = TranslationsIfPlural[0].InnerText.LastIndexOf(" ");
                            string WordSingular = TranslationsIfPlural[0].InnerText.Substring(LastSpaceIndex + 9)
                                .Replace(".", "");
                            return FindSpanishTranslation(WordSingular, PartOfSpeech);
                        }
                        else
                        {
                            continue;
                        }
                    }

                    foreach (var Translation in Translations)
                    {
                        if (Translation.InnerText.IndexOf("\n") != -1)
                        {
                            int Index = Translation.InnerText.IndexOf("\n");
                            TranslationsList.Add(Translation.InnerText.Substring(0, Index).Replace(".", ""));
                        }
                        else
                        {
                            TranslationsList.Add(Translation.InnerText.Replace(".", ""));
                        }
                    }
                }

                if (TranslationsList.Count == 0)
                {
                    foreach (string SpanishPartOfSpeech in SpanishPartsOfSpeech[PartOfSpeech])
                    {
                        var Translations = HTMLDocument.DocumentNode.SelectNodes($"//span[@class='mw-headline'][@id='Inglés']/parent::h2/following-sibling::h4/span[contains(@id, '{SpanishPartOfSpeech}')][1]/parent::h4/following-sibling::dl[1]/dd");

                        if (Translations == null)
                        {
                            var TranslationsIfPlural = HTMLDocument.DocumentNode.SelectNodes($"//span[@class='mw-headline'][@id='Inglés']/parent::h2/following-sibling::h4/span[contains(@id, 'Forma_sustantiva')][1]/parent::h4/following-sibling::dl[1]/dd");
                            if (TranslationsIfPlural != null)
                            {
                                int LastSpaceIndex = TranslationsIfPlural[0].InnerText.LastIndexOf(" ");
                                string WordSingular = TranslationsIfPlural[0].InnerText.Substring(LastSpaceIndex + 9)
                                    .Replace(".", "");
                                return FindSpanishTranslation(WordSingular, PartOfSpeech);
                            }
                            else
                            {
                                continue;
                            }
                        }

                        foreach (var Translation in Translations)
                        {
                            if (Translation.InnerText.IndexOf("\n") != -1)
                            {
                                int Index = Translation.InnerText.IndexOf("\n");
                                TranslationsList.Add(Translation.InnerText.Substring(0, Index).Replace(".", ""));
                            }
                            else
                            {
                                TranslationsList.Add(Translation.InnerText.Replace(".", ""));
                            }
                        }
                    }
                }

                return TranslationsList;
            }
            catch
            {
                return new List<string>();
            }
        }

        public static List<string> FindGermanTranslation(string Word, string PartOfSpeech)
        {
            List<string> TranslationsList = new List<string>();
            Dictionary<string, Array> GermanPartsOfSpeech = new Dictionary<string, Array>();
            GermanPartsOfSpeech.Add("verb", new string[] { "Verb" });
            GermanPartsOfSpeech.Add("adjective", new string[] { "Adjektiv" });
            GermanPartsOfSpeech.Add("noun", new string[] { "Substantiv" });
            GermanPartsOfSpeech.Add("adverb", new string[] { "Adverb" });
            GermanPartsOfSpeech.Add("number", new string[] { "Numerale" });
            GermanPartsOfSpeech.Add("conjunction", new string[] { "Konjunktion" });
            GermanPartsOfSpeech.Add("preposition", new string[] { "Präposition" });
            GermanPartsOfSpeech.Add("pronoun", new string[]
                { "Possessivpronomen", "Personalpronomen", "Pronomen" });
            GermanPartsOfSpeech.Add("determiner", new string[]
                { "Possessivpronomen", "Personalpronomen", "Pronomen" });

            HtmlWeb DictionaryWebsite = new HtmlWeb();
            HtmlDocument HTMLDocument = DictionaryWebsite.Load($"https://de.wiktionary.org/wiki/{Word}");

            try
            {
                foreach (string GermanPartOfSpeech in GermanPartsOfSpeech[PartOfSpeech])
                {
                    var Translations = HTMLDocument.DocumentNode.SelectNodes($"(//span[@class='mw-headline'][contains(@id, 'Englisch')]/parent::h2/following-sibling::h3/span[contains(@id, '{GermanPartOfSpeech}')][1]/parent::h3/following-sibling::p[text()='Bedeutungen:'])[1]/following-sibling::dl[1]/dd");

                    if (Translations == null)
                    {
                        var TranslationsIfIrregural = HTMLDocument.DocumentNode.SelectNodes($"//span[@class='mw-headline'][contains(@id, 'Englisch')]/parent::h2/following-sibling::p[text()='Grammatische Merkmale:']/following-sibling::ul[1]");
                        if (TranslationsIfIrregural != null)
                        {
                            int LastSpaceIndex = TranslationsIfIrregural[0].InnerText.LastIndexOf(" ");
                            string WordSingular = TranslationsIfIrregural[0].InnerText.Substring(LastSpaceIndex);
                            return FindGermanTranslation(WordSingular, PartOfSpeech);
                        }
                        else
                        {
                            continue;
                        }
                    }

                    for (int i = 0; i < (Translations.Count > 3 ? 3 : Translations.Count); i++)
                    {
                        TranslationsList.Add(Translations[i].InnerText.Substring(4).Replace("\n", "").Replace("[15]", "")
                            .Replace("[1]", "").Replace("[2]", "").Replace("[3]", "").Replace("[4]", "").Replace("[5]", "")
                            .Replace("[6]", "").Replace("[7]", "").Replace("[8]", "").Replace("[9]", "").Replace("[10]", "")
                            .Replace("[11]", "").Replace("[12]", "").Replace("[13]", "").Replace("[14]", ""));
                    }
                }

                return TranslationsList;
            }
            catch
            {
                return new List<string>();
            }
        }

        public static List<string> FindFrenchTranslation(string Word, string PartOfSpeech)
        {
            List<string> TranslationsList = new List<string>();
            Dictionary<string, Array> FrenchPartsOfSpeech = new Dictionary<string, Array>();
            FrenchPartsOfSpeech.Add("verb", new string[] { "Verbe" });
            FrenchPartsOfSpeech.Add("adjective", new string[] { "Adjectif" });
            FrenchPartsOfSpeech.Add("noun", new string[] { "Nom_commun" });
            FrenchPartsOfSpeech.Add("adverb", new string[] { "Adverbe" });
            FrenchPartsOfSpeech.Add("number", new string[] { "Adjectif" });
            FrenchPartsOfSpeech.Add("conjunction", new string[] { "Conjonction_de_coordination" });
            FrenchPartsOfSpeech.Add("preposition", new string[] { "Préposition" });
            FrenchPartsOfSpeech.Add("pronoun", new string[]
                { "Pronom_personnel", "Adjectif" });
            FrenchPartsOfSpeech.Add("determiner", new string[]
                { "Pronom_personnel", "Adjectif" });

            HtmlWeb DictionaryWebsite = new HtmlWeb();
            HtmlDocument HTMLDocument = DictionaryWebsite.Load($"https://fr.wiktionary.org/wiki/{Word}");

            try
            {
                foreach (string FrenchPartOfSpeech in FrenchPartsOfSpeech[PartOfSpeech])
                {
                    var Translations = HTMLDocument.DocumentNode.SelectNodes($"((//span[@class='mw-headline'][contains(@id, 'Anglais')]/parent::h2/following-sibling::h3/span[contains(@id, '{FrenchPartOfSpeech}')])[1]/parent::h3/following-sibling::ol)[1]/li");

                    if (Translations == null)
                    {
                        var TranslationsIfPlural = HTMLDocument.DocumentNode.SelectNodes($"((//span[@class='mw-headline'][contains(@id, 'Anglais')]/parent::h2/following-sibling::h3/span[contains(@id, 'Forme_de_nom_commun')])[1]/parent::h3/following-sibling::ol)[1]/li");
                        var TranslationsIfPastParticiple = HTMLDocument.DocumentNode.SelectNodes($"((//span[@class='mw-headline'][contains(@id, 'Anglais')]/parent::h2/following-sibling::h3/span[contains(@id, 'Forme_de_verbe')])[1]/parent::h3/following-sibling::ol)[1]/li");
                        if (TranslationsIfPlural != null)
                        {
                            int LastSpaceIndex = TranslationsIfPlural[0].InnerText.LastIndexOf(" ");
                            string WordSingular = TranslationsIfPlural[0].InnerText.Substring(LastSpaceIndex);
                            return FindFrenchTranslation(WordSingular.Replace(".", ""), PartOfSpeech);
                        }
                        else if (TranslationsIfPastParticiple != null)
                        {
                            int LastSpaceIndex = TranslationsIfPastParticiple[0].InnerText.LastIndexOf(" ");
                            string WordSingular = TranslationsIfPastParticiple[0].InnerText.Substring(LastSpaceIndex);
                            return FindFrenchTranslation(WordSingular.Replace(".", ""), PartOfSpeech);
                        }
                        else
                        {
                            continue;
                        }
                    }

                    for (int i = 0; i < (Translations.Count > 3 ? 3 : Translations.Count); i++)
                    {
                        if (Translations[i].InnerText.IndexOf("\n") != -1)
                        {
                            int Index = Translations[i].InnerText.IndexOf("\n");
                            TranslationsList.Add(Translations[i].InnerText.Substring(0, Index).Replace(".", ""));
                        }
                        else
                        {
                            TranslationsList.Add(Translations[i].InnerText.Replace(".", ""));
                        }
                    }
                }

                return TranslationsList;
            }
            catch
            {
                return new List<string>();
            }
        }

        public static List<string> FindItalianTranslation(string Word, string PartOfSpeech)
        {
            List<string> TranslationsList = new List<string>();
            Dictionary<string, Array> ItalianPartsOfSpeech = new Dictionary<string, Array>();
            ItalianPartsOfSpeech.Add("verb", new string[] { "Verbo", "Voce_verbale" });
            ItalianPartsOfSpeech.Add("adjective", new string[] { "Aggettivo" });
            ItalianPartsOfSpeech.Add("noun", new string[] { "Sostantivo" });
            ItalianPartsOfSpeech.Add("adverb", new string[] { "Avverbio" });
            ItalianPartsOfSpeech.Add("number", new string[] { "Aggettivo_numerale" });
            ItalianPartsOfSpeech.Add("conjunction", new string[] { "Congiunzione" });
            ItalianPartsOfSpeech.Add("preposition", new string[] { "Preposizione" });
            ItalianPartsOfSpeech.Add("pronoun", new string[]
                { "Pronome", "Aggettivo_possessivo" });
            ItalianPartsOfSpeech.Add("determiner", new string[]
                { "Pronome", "Aggettivo_possessivo" });

            HtmlWeb DictionaryWebsite = new HtmlWeb();
            HtmlDocument HTMLDocument = DictionaryWebsite.Load($"https://it.wiktionary.org/wiki/{Word}");

            try
            {
                foreach (string ItalianPartOfSpeech in ItalianPartsOfSpeech[PartOfSpeech])
                {
                    var Translations = HTMLDocument.DocumentNode.SelectNodes($"((//span[@class='mw-headline'][contains(@id, 'Inglese')]/parent::h2/following-sibling::h3/span[contains(@id, '{ItalianPartOfSpeech}')])[1]/parent::h3/following-sibling::ol)[1]/li");

                    if (Translations == null)
                    {
                        continue;
                    }

                    for (int i = 0; i < (Translations.Count > 3 ? 3 : Translations.Count); i++)
                    {
                        if (Translations[i].InnerText.IndexOf("\n") != -1)
                        {
                            int Index = Translations[i].InnerText.IndexOf("\n");
                            TranslationsList.Add(Translations[i].InnerText.Substring(0, Index));
                        }
                        else
                        {
                            TranslationsList.Add(Translations[i].InnerText);
                        }
                    }
                }

                if (TranslationsList.Count == 0)
                {
                    var TranslationsUnFormatted = HTMLDocument.DocumentNode.SelectNodes($"//div[@class='mw-parser-output']/p/a[text()='Inglese']/parent::p/following-sibling::ol/li");

                    if (TranslationsUnFormatted != null)
                    {
                        foreach (var Translation in TranslationsUnFormatted)
                        {
                            if (Translation.InnerText.IndexOf("\n") != -1)
                            {
                                int Index = Translation.InnerText.IndexOf("\n");
                                TranslationsList.Add(Translation.InnerText.Substring(0, Index));
                            }
                            else
                            {
                                TranslationsList.Add(Translation.InnerText);
                            }
                        }
                    }
                }

                return TranslationsList;
            }
            catch
            {
                return new List<string>();
            }
        }

        public static List<string> FindPolishTranslation(string Word, string PartOfSpeech)
        {
            List<string> TranslationsList = new List<string>();
            string PolishPartOfSpeech = "";
            switch (PartOfSpeech)
            {
                case "verb":
                    PolishPartOfSpeech = "{czas.}";
                    break;
                case "adjective":
                    PolishPartOfSpeech = "{przym.}";
                    break;
                case "noun":
                    PolishPartOfSpeech = "{rzecz.}";
                    break;
                case "pronoun":
                    PolishPartOfSpeech = "{zaim.}";
                    break;
                case "adverb":
                    PolishPartOfSpeech = "{przysł.}";
                    break;
                case "preposition":
                    PolishPartOfSpeech = "{przym.}";
                    break;
                case "conjunction":
                    PolishPartOfSpeech = "{spójn.}";
                    break;
                case "number":
                    PolishPartOfSpeech = "{licz.}";
                    break;
                default:
                    return new List<string>();
            }
            HtmlWeb DictionaryWebsite = new HtmlWeb();
            HtmlDocument HTMLDocument = DictionaryWebsite.Load($"https://pl.bab.la/slownik/angielski-polski/{Word}");
            try
            {
                var TranslationInitial = HTMLDocument.DocumentNode.SelectNodes($"/descendant::span[@class='suffix'][text()='{PolishPartOfSpeech}'][1]" +
                        "/parent::div/following-sibling::div[1]/ul/li/a[2]");
                var TranslationsFollowing = HTMLDocument.DocumentNode.SelectNodes($"/descendant::span[@class='suffix'][text()='{PolishPartOfSpeech}'][1]" +
                        "/parent::div/following-sibling::div[1]/ul/li/a[1]");

                if (TranslationInitial == null)
                {
                    return new List<string>();
                }
                if (TranslationInitial != null && TranslationsFollowing[1] == null)
                {
                    TranslationsList.Add(TranslationInitial[0].InnerText);
                    return TranslationsList;
                }

                int TranslationsNumber = TranslationsFollowing.Count < 5 ? TranslationsFollowing.Count : 5;
                string TranslationsString = TranslationInitial[0].InnerText;
                for (int i = 1; i < TranslationsNumber; i++)
                {
                    TranslationsList.Add(TranslationsFollowing[i].InnerText);
                }

                return TranslationsList;
            }
            catch
            {
                return new List<string>();
            }
        }
    }
}