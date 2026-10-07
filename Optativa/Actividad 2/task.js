/*Task 1*/
export function createVisitor(name, age, ticketId) {
  return {
      name,
      age,
      ticketId
    }
};

const createVisitior = (name, age, ticketId) => ({name, age, ticketId});



/*Task 2*/
export function revokeTicket(visitor) {
  visitor.ticketId = null
  return visitor
};



/*Task 3*/
export function ticketStatus(tickets, ticketId) {
  if (tickets[ticketId] === undefined) {
    return 'unknown ticket id';
  }
  
  if (tickets[ticketId] === null) {
    return 'not sold';
  }
  
  return 'sold to ' + tickets[ticketId];
}



/*Task 4*/
export function simpleTicketStatus(tickets, ticketId) {
  if (tickets[ticketId] === null) {
      return 'invalid ticket !!!'; 
  }
  
  if (tickets[ticketId] === undefined) {
      return 'invalid ticket !!!'; 
  }
  
  return tickets[ticketId];
}



/*Task 5*/
export function gtcVersion(visitor) {
  return visitor.gtc?.version;
}