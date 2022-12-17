using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class UserTextCompleteData
    {
        [MaxLength(30)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }

        public List<WordWithLevel> Words { get; set; }

        public string Text { get; set; }

        public decimal PageCount { get; set; }

        public UserTextCompleteData(string _title, string _description,
            List<WordWithLevel> _words, string _text, decimal _pageCount)
        {
            Title = _title;
            Description = _description;
            Words = _words;
            Text = _text;
            PageCount = _pageCount;
        }

        public UserTextCompleteData()
        {
            Title = "";
            Description = "";
            Words = null;
            Text = "";
            PageCount = 1;
        }
    }
}