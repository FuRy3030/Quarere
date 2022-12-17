using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class DictionarySettings
    {
        public int MaxExamples { get; set; }
        public int MaxSynonyms { get; set; }
        public int MaxSenses { get; set; }

        public DictionarySettings(int Examples, int Synonyms, int Senses)
        {
            MaxExamples = Examples;
            MaxSynonyms = Synonyms;
            MaxSenses = Senses;
        }
    }
}