using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class WordOperationsModel
    {
        public class IndexesData
        {
            public int Index { get; set; }
            public WordWithLevel Phrase { get; set; }

            public IndexesData(int _index, WordWithLevel _phrase)
            {
                Index = _index;
                Phrase = _phrase;
            }
        }
    }
}