using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Quarere.Translate_Engine
{
    public class TranslationsFinder
    {
        public static string FindSpanishTranslation(string Word, string PartOfSpeech)
        {
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
                string TranslationsString = "";
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
                            TranslationsString = TranslationsString + Translation.InnerText.Substring(0, Index).Replace('.', ';') + " ";
                        }
                        else
                        {
                            TranslationsString = TranslationsString + Translation.InnerText.Replace('.', ';') + " ";
                        }
                    }
                }

                if (TranslationsString == "")
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
                                TranslationsString = TranslationsString + Translation.InnerText.Substring(0, Index).Replace('.', ';') + " ";
                            }
                            else
                            {
                                TranslationsString = TranslationsString + Translation.InnerText.Replace('.', ';') + " ";
                            }
                        }
                    }
                }

                return TranslationsString.Substring(0, TranslationsString.Length - 2) + ".";
            }
            catch
            {
                return "";
            }
        }

        public static string FindGermanTranslation(string Word, string PartOfSpeech)
        {
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
                string TranslationsString = "";
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
                        TranslationsString = TranslationsString + Translations[i].InnerText.Substring(4).Replace("\n", "")
                            .Replace("[1]", "").Replace("[2]", "").Replace("[3]", "").Replace("[4]", "").Replace("[5]", "")
                            .Replace("[6]", "").Replace("[7]", "").Replace("[8]", "").Replace("[9]", "").Replace("[10]", "")
                            .Replace("[11]", "").Replace("[12]", "").Replace("[13]", "").Replace("[14]", "").Replace("[15]", "")
                            + "; ";
                    }
                }

                return TranslationsString.Substring(0, TranslationsString.Length - 3) + ".";
            }
            catch
            {
                return "";
            }
        }

        public static string FindFrenchTranslation(string Word, string PartOfSpeech)
        {
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
                string TranslationsString = "";
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
                            TranslationsString = TranslationsString + Translations[i].InnerText
                                .Substring(0, Index).Replace('.', ';') + " ";
                        }
                        else
                        {
                            TranslationsString = TranslationsString + Translations[i].InnerText.Replace('.', ';') + " ";
                        }
                    }
                }

                return TranslationsString.Substring(0, TranslationsString.Length - 2) + ".";
            }
            catch
            {
                return "";
            }
        }

        public static string FindItalianTranslation(string Word, string PartOfSpeech)
        {
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
                string TranslationsString = "";
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
                            TranslationsString = TranslationsString + Translations[i].InnerText.Substring(0, Index) + "; ";
                        }
                        else
                        {
                            TranslationsString = TranslationsString + Translations[i].InnerText + "; ";
                        }
                    }
                }

                if (TranslationsString == "")
                {
                    var TranslationsUnFormatted = HTMLDocument.DocumentNode.SelectNodes($"//div[@class='mw-parser-output']/p/a[text()='Inglese']/parent::p/following-sibling::ol/li");

                    if (TranslationsUnFormatted != null)
                    {
                        foreach (var Translation in TranslationsUnFormatted)
                        {
                            if (Translation.InnerText.IndexOf("\n") != -1)
                            {
                                int Index = Translation.InnerText.IndexOf("\n");
                                TranslationsString = TranslationsString + Translation.InnerText.Substring(0, Index) + "; ";
                            }
                            else
                            {
                                TranslationsString = TranslationsString + Translation.InnerText + "; ";
                            }
                        }
                    }
                }

                return TranslationsString.Substring(0, TranslationsString.Length - 2) + ".";
            }
            catch
            {
                return "";
            }
        }
    }
}