using System;
using System.Collections.Generic;

namespace WebApiCore.Models
{
    public partial class OrderItems
    {
        public long OrderItemId { get; set; }
        public long? OrderId { get; set; }
        public int? ItemId { get; set; }
        public int? Quantity { get; set; }

        public Item Item { get; set; }
        public Order Order { get; set; }
    }
}
