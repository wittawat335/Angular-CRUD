using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class OrderController : ApiController
    {
        private AngularDemoEntities db = new AngularDemoEntities();

        // GET: api/Order
        public Object GetOrder()
        {
            try
            {
                var result = (from a in db.Order
                              join b in db.Customer on a.CustomerId equals b.CustomerId
                              select new
                              {
                                  a.OrderId,
                                  a.OrderNo,
                                  Customer = b.Name,
                                  a.PMethod,
                                  a.GTotal,
                                  DeletedOrderItemIds = ""
                              }).ToList();
                return result;
            }
            catch(Exception ex)
            {
                throw ex;
            }          
        }

        // GET: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult GetOrder(long id)
        {
            try
            {
                var order = (from x in db.Order
                             where x.OrderId == id
                             select new
                             {
                                 x.OrderId,
                                 x.OrderNo,
                                 x.CustomerId,
                                 x.PMethod,
                                 x.GTotal,
                                 DeletedOrderItemIds = ""
                             }).FirstOrDefault();

                var orderDetails = (from a in db.OrderItems
                                    join b in db.Item on a.ItemId equals b.ItemId
                                    where a.OrderId == id
                                    select new
                                    {
                                        a.OrderId,
                                        a.OrderItemId,
                                        a.ItemId,
                                        ItemName = b.Name,
                                        b.Price,
                                        a.Quantity,
                                        Total = a.Quantity * b.Price
                                    }).ToList();
                return Ok(new { order, orderDetails});
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        // POST: api/Order=
        [ResponseType(typeof(Order))]
        public IHttpActionResult PostOrder(Order order)
        {
            try
            {
                //Order table
                if (order.OrderId == 0)
                    db.Order.Add(order);
                else
                    //db.Order.Attach(order);
                db.Entry(order).State = EntityState.Modified;

                //OrderItems table
                foreach (var item in order.OrderItems)
                {
                    if (item.OrderItemId == 0)
                        db.OrderItems.Add(item);
                    else
                        db.Entry(item).State = EntityState.Modified;
                }

                //Delete for OrderItems
                if (order.DeletedOrderItemIds != null)
                {
                    foreach (var id in order.DeletedOrderItemIds.Split(',').Where(x => x != ""))
                    {
                        OrderItems x = db.OrderItems.Find(Convert.ToInt64(id));
                        db.OrderItems.Remove(x);
                    }
                }            

                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }     

        // DELETE: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult DeleteOrder(long id)
        {
            Order order = db.Order.Include(y => y.OrderItems)
                .SingleOrDefault(x => x.OrderId == id);
           
            foreach(var item in order.OrderItems.ToList())
            {
                db.OrderItems.Remove(item);
            }

            db.Order.Remove(order);
            db.SaveChanges();

            return Ok(order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderExists(long id)
        {
            return db.Order.Count(e => e.OrderId == id) > 0;
        }
    }
}