﻿using System;
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
        private RestaurantDBEntities db = new RestaurantDBEntities();

        // GET: api/Order
        public Object GetOrders()
        {
            try
            {
                var result = (from a in db.Orders
                              join b in db.Customers on a.CustomerID equals b.CustomerID
                              select new
                              {
                                  a.OrderID,
                                  a.OrderNo,
                                  Customer = b.Name,
                                  a.PMethod,
                                  a.GTotal
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
                var order = db.Orders.FirstOrDefault(x => x.OrderID == id);
                var orderDetails = (from a in db.OrderItems
                                    join b in db.Items on a.ItemID equals b.ItemID
                                    where a.OrderID == id
                                    select new
                                    {
                                        a.OrderID,
                                        a.OrderItemID,
                                        a.ItemID,
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

        // POST: api/Order
        [ResponseType(typeof(Order))]
        public IHttpActionResult PostOrder(Order order)
        {
            try
            {
                //Order table
                if (order.OrderID == 0)
                    db.Orders.Add(order);
                else
                    //db.Order.Attach(order);
                db.Entry(order).State = EntityState.Modified;

                //OrderItems table
                foreach (var item in order.OrderItems)
                {
                    if (item.OrderItemID == 0)
                        db.OrderItems.Add(item);
                    else
                        db.Entry(item).State = EntityState.Modified;
                }

                //Delete for OrderItems
                foreach (var id in order.DeletedOrderItemIDs.Split(',').Where(x => x != ""))
                {
                    OrderItem x = db.OrderItems.Find(Convert.ToInt64(id));
                    db.OrderItems.Remove(x);
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
            Order order = db.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }

            db.Orders.Remove(order);
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
            return db.Orders.Count(e => e.OrderID == id) > 0;
        }
    }
}