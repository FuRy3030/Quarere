using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class UserText
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime CreationTime { get; set; }
        public UserText(string _title, DateTime _creationTime)
        {
            Id = "text";
            Title = _title;
            CreationTime = _creationTime;
        }
    }

    public class UserCollection
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public int TermsCount { get; set; }
        public DateTime CreationTime { get; set; }
        public UserCollection(string _title, DateTime _creationTime)
        {
            Id = "collection";
            Title = _title;
            TermsCount = 0;
            CreationTime = _creationTime;
        }
    }

    public class UserCollectionGeneral
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int TermsCount { get; set; }
        public DateTime CreationTime { get; set; }
        public UserCollectionGeneral(string _title, string _description, DateTime _creationTime)
        {
            Title = _title;
            Description = _description;
            TermsCount = 0;
            CreationTime = _creationTime;
        }
    }

    public class UserFavourite
    {
        public string Title { get; set; }
        public int TermsCount { get; set; }
        public DateTime CreationTime { get; set; }
        public UserFavourite(string _title, int _termsCount, DateTime _creationTime)
        {
            Title = _title;
            TermsCount = _termsCount;
            CreationTime = _creationTime;
        }
    }

    public class ColectionFullData
    {
        public Queue<FlashcardExtended> Flashcards { get; set; }
        public UserCollectionGeneral GeneralData { get; set; }
    }

    public class TextEditData
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Text { get; set; }
        public TextEditData()
        {
            Title = "";
            Description = "";
            Text = "";
        }
        public TextEditData(string _title, string _description, string _text)
        {
            Title = _title;
            Description = _description;
            Text = _text;
        }
    }
}