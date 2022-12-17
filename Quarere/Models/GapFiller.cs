using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class GapFiller
    {
        public string LeftSide { get; set; }
        public string MissingWord { get; set; }
        public string RightSide { get; set; }

        public GapFiller(string _leftSide, string _missingWord, string _rightSide)
        {
            LeftSide = _leftSide;
            MissingWord = _missingWord;
            RightSide = _rightSide;
        }
    }
}