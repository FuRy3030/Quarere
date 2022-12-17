using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class WordWithLevel
    {
        public string Word { get; set; }
        public string Level { get; set; }

        public WordWithLevel(string _word, string _level)
        {
            Word = _word;
            Level = _level;
        }
    }

    public class WordProperties
    {
        public string Word { get; set; }
        public PhoneticData Phonetics { get; set; }        
        public string WordOrigin { get; set; }
        public List<WordVariantWithNativeTranslation> Meanings { get; set; }
        public string Level { get; set; }

        public WordProperties(string _word, PhoneticData _phonetics, 
            string _wordOrigin, List<WordVariantWithNativeTranslation> _meanings, string _level)
        {
            Word = _word;
            Phonetics = _phonetics;
            WordOrigin = _wordOrigin;
            Meanings = _meanings;
            Level = _level;
        }

        public WordProperties(string _word, string _level)
        {
            Word = _word;
            Phonetics = null;
            WordOrigin = "";
            Meanings = null;
            Level = _level;
        }

        public WordProperties()
        {
            Word = "";
            Phonetics = null;
            WordOrigin = "";
            Meanings = null;
            Level = "";
        }
    }

    public class PhoneticData
    {
        public string PhoneticText { get; set; }
        public string Audio { get; set; }
        public PhoneticData(string _phoneticText, string _audio)
        {
            PhoneticText = _phoneticText;
            Audio = _audio;
        }
    }

    public class WordVariantWithNativeTranslation
    {
        public string PartOfSpeech { get; set; }
        public WordAssociationsWithNativeTranslation Definition { get; set; }
    }

    public class WordVariant
    {
        public string PartOfSpeech { get; set; }
        public List<WordAssociations> Definitions { get; set; }
    }

    public class WordAssociationsWithNativeTranslation
    {
        public string Definition { get; set; }
        public string NativeDefinition { get; set; }
        public string Example { get; set; }
        public List<string> Synonyms { get; set; }
        public List<string> Antonyms { get; set; }
    }

    public class WordAssociations
    {
        public string Definition { get; set; }
        public string Example { get; set; }
        public List<string> Synonyms { get; set; }
        public List<string> Antonyms { get; set; }
    }
}



