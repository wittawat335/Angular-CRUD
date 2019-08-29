using System;
using System.Collections.Generic;

namespace WebApiCore.Models
{
    public partial class PaymentDetails
    {
        public int Pmid { get; set; }
        public string CardOwnerName { get; set; }
        public string CardNumber { get; set; }
        public string ExpirationDate { get; set; }
        public string Cvv { get; set; }
    }
}
