using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class FlashcardsFields
    {
        public string FrontField { get; set; }
        public string BackField { get; set; }

        public FlashcardsFields(string _front, string _back)
        {
            FrontField = _front;
            BackField = _back;
        }

        public FlashcardsFields()
        {
            FrontField = "";
            BackField = "";
        }
    }
}