using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class CompactDictionaryEntity
    {
        public string Word { get; set; }
        public PhoneticData Phonetics { get; set; }
        public string WordOrigin { get; set; }
        public List<PartOfSpeechVariant> Meanings { get; set; }
        public List<RelatedPhrase> RelatedPhrases { get; set; }
        public string Level { get; set; }

        public CompactDictionaryEntity(string _word, PhoneticData _phonetics,
            string _wordOrigin, List<PartOfSpeechVariant> _meanings, string _level)
        {
            Word = _word;
            Phonetics = _phonetics;
            WordOrigin = _wordOrigin;
            Meanings = _meanings;
            Level = _level;
        }

        public CompactDictionaryEntity(string _word, string _level)
        {
            Word = _word;
            Phonetics = null;
            WordOrigin = "";
            Meanings = null;
            Level = _level;
        }

        public CompactDictionaryEntity()
        {
            Word = "";
            Phonetics = null;
            WordOrigin = "";
            Meanings = null;
            Level = "";
        }
    }

    public class PartOfSpeechVariant
    {
        public string PartOfSpeech { get; set; }
        public List<string> NativeDefinition { get; set; }
        public List<string> ConjugationForms { get; set; }
        public List<Sense> Senses { get; set; }
    }

    public class Sense
    {
        public List<string> Examples { get; set; }
        public string ShortDefinition { get; set; }
        public string Definition { get; set; }
        public List<string> Synonyms { get; set; }
        public List<string> Antonyms { get; set; }
        public List<SubSense> SubSenses { get; set; }
    }

    public class SubSense
    {
        public List<string> Examples { get; set; }
        public string ShortDefinition { get; set; }
        public string Definition { get; set; }
        public List<string> Synonyms { get; set; }
        public List<string> Antonyms { get; set; }
    }

    public class ConiugationForms
    {
        public string ThirdPerson { get; set; }
        public string PastTense { get; set; }
        public string PastParticiple { get; set; }
        public string Gerund { get; set; }
    }

    public class RelatedPhrase
    {
        public string Phrase { get; set; }
        public string Meaning { get; set; }
        public string Example { get; set; }
    }
}