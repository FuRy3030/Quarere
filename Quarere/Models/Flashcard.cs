using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class Flashcard
    {
        public string Word { get; set; }

        public string Meaning { get; set; }

        public string Synonyms { get; set; }

        public string NativeDef { get; set; }

        public string Example { get; set; }

        public string InContext { get; set; }
    }

    public class FlashcardWithFavourite
    {
        public string Word { get; set; }

        public string Meaning { get; set; }

        public string Synonyms { get; set; }

        public string NativeDef { get; set; }

        public string Example { get; set; }

        public string InContext { get; set; }

        public string IsFavourite { get; set; }
    }

    public class FlashcardExtended
    {
        public string Word { get; set; }

        public string Meaning { get; set; }

        public string Synonyms { get; set; }

        public string NativeDef { get; set; }

        public string Example { get; set; }

        public string InContext { get; set; }

        public string IsFavourite { get; set; }

        public string ProgressLevel { get; set; }
    }
}