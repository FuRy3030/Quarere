using Newtonsoft.Json.Linq;
using Quarere.Classes;
using Quarere.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using static Quarere.Classes.WordsOperations;

namespace Quarere.Translate_Engine
{
    public class TranslateEngine
    {
        public static async Task<WordProperties> GetWordProperties(string Word, string Language)
        {
            var QueryResult = await TranslateEngine.QueryInternet(Word);
            return await TranslateEngine.Transform(QueryResult, Word, Language);
        }

        public static async Task<CompactDictionaryEntity> GetDictionaryData(string Word, string Language)
        {
            var QueryResult = await TranslateEngine.QueryInternet(Word);
            return CompactDictionaryEngine.TransformData(QueryResult, Word, Language);
        }

        public static async Task<CompactDictionaryEntity> GetDictionaryDataLongWord(string Word)
        {
            var QueryResult = await TranslateEngine.QueryInternet(Word);
            return CompactDictionaryEngine.TransformDataLongWord(QueryResult, Word);
        }

        public static async Task<JToken> QueryInternet(string Word)
        {
            string URL = @"https://www.google.com/async/callback:5493";
            var URLBuilder = new UriBuilder(URL);
            var Parameters = HttpUtility.ParseQueryString(URLBuilder.Query);
            Parameters["fc"] = "ErUBCndBTlVfTnFUN29LdXdNSlQ2VlZoWUIwWE1HaElOclFNU29TOFF4ZGxGbV9zbzA3YmQ2NnJyQXlHNVlrb3l3OXgtREpRbXpNZ0M1NWZPeFo4NjQyVlA3S2ZQOHpYa292MFBMaDQweGRNQjR4eTlld1E4bDlCbXFJMBIWU2JzSllkLVpHc3J5OVFPb3Q2aVlDZxoiQU9NWVJ3QmU2cHRlbjZEZmw5U0lXT1lOR3hsM2xBWGFldw";
            Parameters["fcv"] = "3";
            Parameters["async"] = $"term:{Uri.EscapeUriString(Word)},corpus:en," +
                $"hhdr:true,hwdgt:true,wfp:true,ttl:,tsl:,ptl:";
            URLBuilder.Query = Parameters.ToString();
            URL = URLBuilder.ToString();

            HttpClient Client = new HttpClient();
            var Request = new HttpRequestMessage(HttpMethod.Get, URL);

            if (Client == null)
            {
                HttpClientHandler ClientConfiguration = new HttpClientHandler
                {
                    Proxy = null,
                    UseProxy = false
                };
                Client = HttpClientFactory.Create(ClientConfiguration);
                Client.Timeout = TimeSpan.FromSeconds(5.5);
            }

            var Response = await Client.SendAsync(Request);
            string JSONToFilter = await Response.Content.ReadAsStringAsync();

            JObject UnstructuredResponse = JObject.Parse(JSONToFilter.Substring(4));
            return UnstructuredResponse["feature-callback"]["payload"]["single_results"];
        }

        public static async Task<WordProperties> Transform(JToken QueryResult, string Word, string Language)
        {
            WordProperties CurrentWordProperties = new WordProperties();
            JArray Entries = new JArray();
            foreach (var Result in QueryResult)
            {
                Entries.Add(Result["entry"]);
            }

            // Level Access 
            CurrentWordProperties.Level = FindWordLevel(Word);

            // Word Origin Access
            try
            {
                CurrentWordProperties.WordOrigin = Entries[0]["etymology"]["etymology"]["text"].ToString();
            }
            catch 
            {
                CurrentWordProperties.WordOrigin = "";
            }

            // Phonetics Access
            try
            {
                string PhoneticText = Entries[0]["phonetics"][0]["text"].ToString();
                string AudioLink = Entries[0]["phonetics"][0]["oxford_audio"].ToString();
                CurrentWordProperties.Phonetics = new PhoneticData(PhoneticText, AudioLink);
            }
            catch
            {
                try
                {
                    string PhoneticText = Entries[0]["sense_families"][0]["phonetics"][0]["text"].ToString();
                    string AudioLink = Entries[0]["sense_families"][0]["phonetics"][0]["oxford_audio"].ToString();
                    CurrentWordProperties.Phonetics = new PhoneticData(PhoneticText, AudioLink);
                }
                catch
                {
                    CurrentWordProperties.Phonetics = new PhoneticData("", "");
                }
            }

            // Get the remaining parts (parts of speech, definitions, etc.)
            CurrentWordProperties.Meanings = new List<WordVariantWithNativeTranslation>();
            try
            {
                if (Entries[0]["sense_families"][0]["parts_of_speech"] == null ||
                    Entries[0]["sense_families"][0]["parts_of_speech"][0]["value"] == null ||
                    Entries[0]["sense_families"][0]["parts_of_speech"][0]["value"].ToString() == "")
                {
                    // Leave null
                }
                else
                {
                    foreach (var Entry in Entries)
                    {
                        foreach (var SenseFamily in Entry["sense_families"])
                        {
                            // Get part of speech
                            WordVariantWithNativeTranslation CurrentVariant = new WordVariantWithNativeTranslation();
                            try
                            {
                                CurrentVariant.PartOfSpeech = SenseFamily["parts_of_speech"][0]["value"].ToString();
                            }
                            catch
                            {
                                break;
                            }

                            WordAssociationsWithNativeTranslation CurrentProperties = new WordAssociationsWithNativeTranslation();
                            switch(Language)
                            {
                                case "Polish":
                                    CurrentProperties.NativeDefinition = 
                                        WordsOperations.FindPolishTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "German":
                                    CurrentProperties.NativeDefinition =
                                        TranslationsFinder.FindGermanTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "Spanish":
                                    CurrentProperties.NativeDefinition =
                                        TranslationsFinder.FindSpanishTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "French":
                                    CurrentProperties.NativeDefinition =
                                        TranslationsFinder.FindFrenchTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "Italian":
                                    CurrentProperties.NativeDefinition =
                                        TranslationsFinder.FindItalianTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                default:
                                    CurrentProperties.NativeDefinition = "";
                                    break;
                            }
                            CurrentProperties.Synonyms = new List<string>();
                            CurrentProperties.Antonyms = new List<string>();

                            // Get Definition
                            try
                            {
                                CurrentProperties.Definition = SenseFamily["senses"][0]["definition"]["text"].ToString();
                            }
                            catch
                            {
                                CurrentProperties.Definition = "";
                            }

                            // Get Example
                            try
                            {
                                if (SenseFamily["senses"][0]["example_groups"] != null)
                                {
                                    CurrentProperties.Example = SenseFamily["senses"][0]["example_groups"][0]
                                        ["examples"][0].ToString();
                                }
                                else
                                {
                                    CurrentProperties.Example = SenseFamily["senses"][0]["additional_examples"][0].ToString();
                                }
                            }
                            catch
                            {
                                CurrentProperties.Example = "";
                            }

                            // Get Synonyms
                            try
                            {
                                bool AreSynonymsFull = false;
                                if (SenseFamily["senses"] != null)
                                {
                                    foreach (var Sense in SenseFamily["senses"])
                                    {
                                        if (Sense["subsenses"] != null)
                                        {
                                            if (AreSynonymsFull == true)
                                            {
                                                break;
                                            }
                                            foreach (var SubSense in Sense["subsenses"])
                                            {
                                                if (SubSense["thesaurus_entries"] != null &&
                                                    SubSense["thesaurus_entries"][0]["synonyms"] != null)
                                                {
                                                    foreach (var Synonym in SubSense["thesaurus_entries"][0]["synonyms"][0]["nyms"])
                                                    {
                                                        CurrentProperties.Synonyms.Add(Synonym["nym"].ToString());
                                                    }
                                                    if (CurrentProperties.Synonyms.Count > 12)
                                                    {
                                                        Debug.WriteLine("max");
                                                        AreSynonymsFull = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (Sense["thesaurus_entries"] != null &&
                                                Sense["thesaurus_entries"][0]["synonyms"] != null)
                                            {
                                                foreach (var Synonym in Sense["thesaurus_entries"][0]["synonyms"][0]["nyms"])
                                                {
                                                    CurrentProperties.Synonyms.Add(Synonym["nym"].ToString());
                                                }
                                                if (CurrentProperties.Synonyms.Count > 12)
                                                {
                                                    Debug.WriteLine("max");
                                                    AreSynonymsFull = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            catch
                            {
                                // Leave null
                            }

                            // Get Antonyms
                            try
                            {
                                if (SenseFamily["senses"] != null)
                                {
                                    foreach (var Sense in SenseFamily["senses"])
                                    {
                                        if (Sense["subsenses"] != null)
                                        {
                                            foreach (var SubSense in Sense["subsenses"])
                                            {
                                                if (SubSense["thesaurus_entries"] != null &&
                                                    SubSense["thesaurus_entries"][0]["antonyms"] != null)
                                                {
                                                    foreach (var Antonym in SubSense["thesaurus_entries"][0]["antonyms"][0]["nyms"])
                                                    {
                                                        CurrentProperties.Antonyms.Add(Antonym["nym"].ToString());
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            catch
                            {
                                // Leave null
                            }

                            if (CurrentProperties.Synonyms.Count > 13)
                            {
                                CurrentProperties.Synonyms = CurrentProperties.Synonyms.GetRange(0, 13);
                            }

                            CurrentVariant.Definition = CurrentProperties;
                            CurrentWordProperties.Meanings.Add(CurrentVariant);
                        }
                    }
                }
            }
            catch
            {
                // Leave null
            }

            return CurrentWordProperties;
        }
    }
}