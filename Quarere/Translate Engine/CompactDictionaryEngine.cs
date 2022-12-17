using Newtonsoft.Json.Linq;
using Quarere.Classes;
using Quarere.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using static Quarere.Classes.WordsOperations;

namespace Quarere.Translate_Engine
{
    public class CompactDictionaryEngine
    {
        public static CompactDictionaryEntity TransformData(JToken QueryResult, string Word, string Language)
        {
            CompactDictionaryEntity CurrentWordProperties = new CompactDictionaryEntity();
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
            CurrentWordProperties.Meanings = new List<PartOfSpeechVariant>();
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
                            PartOfSpeechVariant CurrentVariant = new PartOfSpeechVariant();
                            try
                            {
                                CurrentVariant.PartOfSpeech = SenseFamily["parts_of_speech"][0]["value"].ToString();
                            }
                            catch
                            {
                                break;
                            }

                            switch (Language)
                            {
                                case "Polish":
                                    CurrentVariant.NativeDefinition =
                                        TranslationsFinderArrays.FindPolishTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "German":
                                    CurrentVariant.NativeDefinition =
                                        TranslationsFinderArrays.FindGermanTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "Spanish":
                                    CurrentVariant.NativeDefinition =
                                        TranslationsFinderArrays.FindSpanishTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "French":
                                    CurrentVariant.NativeDefinition =
                                        TranslationsFinderArrays.FindFrenchTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                case "Italian":
                                    CurrentVariant.NativeDefinition =
                                        TranslationsFinderArrays.FindItalianTranslation(Word, CurrentVariant.PartOfSpeech);
                                    break;
                                default:
                                    CurrentVariant.NativeDefinition = new List<string>();
                                    break;
                            }

                            CurrentVariant.ConjugationForms = new List<string>();

                            try
                            {
                                switch (CurrentVariant.PartOfSpeech)
                                {
                                    case "verb":
                                        ConiugationForms CurrentConiugationForms = new ConiugationForms();

                                        foreach (var Form in SenseFamily["morph_units"])
                                        {
                                            switch (Form["form_type"]["description"].ToString())
                                            {
                                                case "3rd person present":
                                                    CurrentConiugationForms.ThirdPerson = Form["word_form"].ToString();
                                                    break;
                                                case "past tense":
                                                    CurrentConiugationForms.PastTense = Form["word_form"].ToString();
                                                    break;
                                                case "past participle":
                                                    CurrentConiugationForms.PastParticiple = Form["word_form"].ToString();
                                                    break;
                                                case "gerund or present participle":
                                                    CurrentConiugationForms.Gerund = Form["word_form"].ToString();
                                                    break;
                                            }
                                        }

                                        foreach (PropertyInfo Property in CurrentConiugationForms.GetType().GetProperties())
                                        {
                                            CurrentVariant.ConjugationForms.Add
                                                (Property.GetValue(CurrentConiugationForms, null).ToString());
                                        }
                                        break;

                                    case "adjective":
                                        foreach (var Form in SenseFamily["morph_units"])
                                        {
                                            CurrentVariant.ConjugationForms.Add(Form["word_form"].ToString());
                                        }
                                        break;

                                    case "noun":
                                        foreach (var Form in SenseFamily["morph_units"])
                                        {
                                            CurrentVariant.ConjugationForms.Add(Form["word_form"].ToString());
                                        }
                                        break;
                                }
                            }
                            catch
                            {
                                // Leave Empty List
                            }

                            CurrentVariant.Senses = new List<Sense>();

                            foreach (var JSONSense in SenseFamily["senses"])
                            {
                                Sense CurrentSense = new Sense();

                                CurrentSense.Examples = new List<string>();
                                CurrentSense.Synonyms = new List<string>();
                                CurrentSense.Antonyms = new List<string>();
                                CurrentSense.SubSenses = new List<SubSense>();

                                // Get Definition
                                try
                                {
                                    CurrentSense.Definition = JSONSense["definition"]["text"].ToString();
                                }
                                catch
                                {
                                    CurrentSense.Definition = "";
                                }

                                // Get Short Definition
                                try
                                {
                                    CurrentSense.ShortDefinition = JSONSense["concise_definition"].ToString();
                                }
                                catch
                                {
                                    CurrentSense.ShortDefinition = "";
                                }

                                // Get Examples
                                try
                                {
                                    if (JSONSense["additional_examples"] != null && JSONSense["additional_examples"][0] != null)
                                    {
                                        foreach (var Example in JSONSense["additional_examples"])
                                        {
                                            CurrentSense.Examples.Add(Example.ToString());
                                        }                                        
                                    }
                                    else
                                    {                                   
                                        CurrentSense.Examples.Add(JSONSense["example_groups"][0]["examples"][0].ToString());
                                    }
                                }
                                catch
                                {
                                    // Leave empty list
                                }

                                // Get Synonyms
                                try
                                {
                                    if (JSONSense["thesaurus_entries"] != null && 
                                        JSONSense["thesaurus_entries"][0]["synonyms"] != null)
                                    {
                                        foreach (var Synonym in JSONSense["thesaurus_entries"][0]["synonyms"][0]["nyms"])
                                        {
                                            CurrentSense.Synonyms.Add(Synonym["nym"].ToString());
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
                                    if (JSONSense["thesaurus_entries"] != null &&
                                        JSONSense["thesaurus_entries"][0]["antonyms"] != null)
                                    {
                                        foreach (var Antonym in JSONSense["thesaurus_entries"][0]["antonyms"][0]["nyms"])
                                        {
                                            CurrentSense.Antonyms.Add(Antonym["nym"].ToString());
                                        }
                                    }
                                }
                                catch
                                {
                                    // Leave null
                                }

                                if (JSONSense["subsenses"] != null)
                                {
                                    foreach (var JSONSubSense in JSONSense["subsenses"])
                                    {
                                        SubSense CurrentSubSense = new SubSense();

                                        CurrentSubSense.Examples = new List<string>();
                                        CurrentSubSense.Synonyms = new List<string>();
                                        CurrentSubSense.Antonyms = new List<string>();

                                        // Get SubSense Definition
                                        try
                                        {
                                            CurrentSubSense.Definition = JSONSubSense["definition"]["text"].ToString();
                                        }
                                        catch
                                        {
                                            CurrentSubSense.Definition = "";
                                        }

                                        // Get SubSense Short Definition
                                        try
                                        {
                                            CurrentSubSense.ShortDefinition = JSONSubSense["concise_definition"].ToString();
                                        }
                                        catch
                                        {
                                            CurrentSubSense.ShortDefinition = "";
                                        }

                                        // Get SubSense Examples
                                        try
                                        {
                                            if (JSONSubSense["additional_examples"] != null &&
                                                JSONSubSense["additional_examples"][0] != null)
                                            {
                                                foreach (var Example in JSONSubSense["additional_examples"])
                                                {
                                                    CurrentSubSense.Examples.Add(Example.ToString());
                                                }
                                            }
                                            else
                                            {
                                                CurrentSubSense.Examples.Add(JSONSubSense["example_groups"][0]["examples"][0].ToString());
                                            }
                                        }
                                        catch
                                        {
                                            // Leave empty list
                                        }

                                        // Get SubSense Synonyms
                                        try
                                        {
                                            if (JSONSubSense["thesaurus_entries"] != null &&
                                                JSONSubSense["thesaurus_entries"][0]["synonyms"] != null)
                                            {
                                                foreach (var Synonym in 
                                                    JSONSubSense["thesaurus_entries"][0]["synonyms"][0]["nyms"])
                                                {
                                                    CurrentSubSense.Synonyms.Add(Synonym["nym"].ToString());
                                                }
                                            }
                                        }
                                        catch
                                        {
                                            // Leave null
                                        }

                                        // Get SubSense Antonyms
                                        try
                                        {
                                            if (JSONSubSense["thesaurus_entries"] != null &&
                                                JSONSubSense["thesaurus_entries"][0]["antonyms"] != null)
                                            {
                                                foreach (var Antonym in 
                                                    JSONSubSense["thesaurus_entries"][0]["antonyms"][0]["nyms"])
                                                {
                                                    CurrentSubSense.Antonyms.Add(Antonym["nym"].ToString());
                                                }
                                            }
                                        }
                                        catch
                                        {
                                            // Leave null
                                        }

                                        CurrentSense.SubSenses.Add(CurrentSubSense);
                                    }
                                }

                                CurrentVariant.Senses.Add(CurrentSense);
                            }

                            CurrentWordProperties.Meanings.Add(CurrentVariant);
                        }
                    }
                }
            }
            catch
            {
                // Leave Empty List
            }

            // Get Related Phrases
            CurrentWordProperties.RelatedPhrases = new List<RelatedPhrase>();
            try
            {
                foreach (var Entry in Entries)
                {
                    if (Entry["subentry_snippets"] != null)
                    {
                        foreach (var Phrase in Entry["subentry_snippets"])
                        {
                            RelatedPhrase CurrentPhrase = new RelatedPhrase();
                            CurrentPhrase.Phrase = Phrase["snippet"]["lemma"].ToString();
                            CurrentPhrase.Meaning = Phrase["snippet"]["definition"].ToString();
                            if (Phrase["snippet"]["definition"] != null)
                            {
                                CurrentPhrase.Meaning = Phrase["snippet"]["definition"].ToString();
                            }
                            else
                            {
                                CurrentPhrase.Meaning = "";
                            }
                            if (Phrase["snippet"]["example"] != null)
                            {
                                CurrentPhrase.Example = Phrase["snippet"]["example"].ToString();
                            }
                            else
                            {
                                CurrentPhrase.Example = "";
                            }
                            CurrentWordProperties.RelatedPhrases.Add(CurrentPhrase);
                        }
                    }
                }
            }
            catch
            {
                // Leave Empty List
            }

            return CurrentWordProperties;
        }

        public static CompactDictionaryEntity TransformDataLongWord(JToken QueryResult, string Word)
        {
            CompactDictionaryEntity CurrentWordProperties = new CompactDictionaryEntity();
            JArray Entries = new JArray();
            foreach (var Result in QueryResult)
            {
                Entries.Add(Result["entry"]);
            }

            // Level Access 
            CurrentWordProperties.Level = FindWordLevel(Word);

            //Empty Values
            CurrentWordProperties.WordOrigin = "";
            CurrentWordProperties.Phonetics = new PhoneticData("", "");
            CurrentWordProperties.RelatedPhrases = new List<RelatedPhrase>();

            // Get the remaining parts (parts of speech, definitions, etc.)
            CurrentWordProperties.Meanings = new List<PartOfSpeechVariant>();
            try
            {
                if (Entries[0]["subentries"] == null ||
                    Entries[0]["subentries"][0]["sense_family"] == null ||
                    Entries[0]["subentries"][0]["sense_family"]["senses"] == null)
                {
                    // Leave null
                }
                else
                {
                    foreach (var Entry in Entries)
                    {
                        foreach (var SubEntry in Entry["subentries"])
                        {
                            PartOfSpeechVariant CurrentVariant = new PartOfSpeechVariant();
                            CurrentVariant.PartOfSpeech = "Phrase / Phrasal Verb";
                            CurrentVariant.NativeDefinition = new List<string>();
                            CurrentVariant.ConjugationForms = new List<string>();

                            CurrentVariant.Senses = new List<Sense>();

                            foreach (var JSONSense in SubEntry["sense_family"]["senses"])
                            {
                                Sense CurrentSense = new Sense();

                                CurrentSense.Examples = new List<string>();
                                CurrentSense.Synonyms = new List<string>();
                                CurrentSense.Antonyms = new List<string>();
                                CurrentSense.SubSenses = new List<SubSense>();

                                // Get Definition
                                try
                                {
                                    CurrentSense.Definition = JSONSense["definition"]["text"].ToString();
                                }
                                catch
                                {
                                    CurrentSense.Definition = "";
                                }

                                // Get Short Definition
                                try
                                {
                                    CurrentSense.ShortDefinition = JSONSense["concise_definition"].ToString();
                                }
                                catch
                                {
                                    CurrentSense.ShortDefinition = "";
                                }

                                // Get Examples
                                try
                                {
                                    if (JSONSense["additional_examples"] != null && JSONSense["additional_examples"][0] != null)
                                    {
                                        foreach (var Example in JSONSense["additional_examples"])
                                        {
                                            CurrentSense.Examples.Add(Example.ToString());
                                        }
                                    }
                                    else
                                    {
                                        foreach (var Example in JSONSense["example_groups"])
                                        {
                                            CurrentSense.Examples.Add(Example["examples"][0].ToString());
                                        }
                                    }
                                }
                                catch
                                {
                                    // Leave empty list
                                }

                                // Get Synonyms
                                try
                                {
                                    if (JSONSense["thesaurus_entries"] != null &&
                                        JSONSense["thesaurus_entries"][0]["synonyms"] != null)
                                    {
                                        foreach (var Synonym in JSONSense["thesaurus_entries"][0]["synonyms"][0]["nyms"])
                                        {
                                            CurrentSense.Synonyms.Add(Synonym["nym"].ToString());
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
                                    if (JSONSense["thesaurus_entries"] != null &&
                                        JSONSense["thesaurus_entries"][0]["antonyms"] != null)
                                    {
                                        foreach (var Antonym in JSONSense["thesaurus_entries"][0]["antonyms"][0]["nyms"])
                                        {
                                            CurrentSense.Antonyms.Add(Antonym["nym"].ToString());
                                        }
                                    }
                                }
                                catch
                                {
                                    // Leave null
                                }

                                if (JSONSense["subsenses"] != null)
                                {
                                    foreach (var JSONSubSense in JSONSense["subsenses"])
                                    {
                                        SubSense CurrentSubSense = new SubSense();

                                        CurrentSubSense.Examples = new List<string>();
                                        CurrentSubSense.Synonyms = new List<string>();
                                        CurrentSubSense.Antonyms = new List<string>();

                                        // Get SubSense Definition
                                        try
                                        {
                                            CurrentSubSense.Definition = JSONSubSense["definition"]["text"].ToString();
                                        }
                                        catch
                                        {
                                            CurrentSubSense.Definition = "";
                                        }

                                        // Get SubSense Short Definition
                                        try
                                        {
                                            CurrentSubSense.ShortDefinition = JSONSubSense["concise_definition"].ToString();
                                        }
                                        catch
                                        {
                                            CurrentSubSense.ShortDefinition = "";
                                        }

                                        // Get SubSense Examples
                                        try
                                        {
                                            if (JSONSubSense["additional_examples"] != null &&
                                                JSONSubSense["additional_examples"][0] != null)
                                            {
                                                foreach (var Example in JSONSubSense["additional_examples"])
                                                {
                                                    CurrentSubSense.Examples.Add(Example.ToString());
                                                }
                                            }
                                            foreach (var Example in JSONSubSense["example_groups"])
                                            {
                                                CurrentSense.Examples.Add(Example["examples"][0].ToString());
                                            }
                                        }
                                        catch
                                        {
                                            // Leave empty list
                                        }

                                        // Get SubSense Synonyms
                                        try
                                        {
                                            if (JSONSubSense["thesaurus_entries"] != null &&
                                                JSONSubSense["thesaurus_entries"][0]["synonyms"] != null)
                                            {
                                                foreach (var Synonym in
                                                    JSONSubSense["thesaurus_entries"][0]["synonyms"][0]["nyms"])
                                                {
                                                    CurrentSubSense.Synonyms.Add(Synonym["nym"].ToString());
                                                }
                                            }
                                        }
                                        catch
                                        {
                                            // Leave null
                                        }

                                        // Get SubSense Antonyms
                                        try
                                        {
                                            if (JSONSubSense["thesaurus_entries"] != null &&
                                                JSONSubSense["thesaurus_entries"][0]["antonyms"] != null)
                                            {
                                                foreach (var Antonym in
                                                    JSONSubSense["thesaurus_entries"][0]["antonyms"][0]["nyms"])
                                                {
                                                    CurrentSubSense.Antonyms.Add(Antonym["nym"].ToString());
                                                }
                                            }
                                        }
                                        catch
                                        {
                                            // Leave null
                                        }

                                        CurrentSense.SubSenses.Add(CurrentSubSense);
                                    }
                                }

                                CurrentVariant.Senses.Add(CurrentSense);
                            }

                            CurrentWordProperties.Meanings.Add(CurrentVariant);
                        }
                    }
                }
            }
            catch
            {
                // Leave Empty List
            }

            return CurrentWordProperties;
        }
    }
}