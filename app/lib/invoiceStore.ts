export type Invoice = {
  id: string;
  client: string;
  email: string;
  project: string;
  amount: string;
  details: string;
  status: string;
  date: string;
  dueDate: string;
  company: string;
};

export function saveInvoice(invoice: Invoice) {

  if (typeof window === "undefined") {
    return;
  }

  const oldInvoices =
    JSON.parse(localStorage.getItem("invoices") || "[]");
oldInvoices.push({
  ...invoice,
  id: `INV-${Date.now().toString().slice(-6)}`,
  date: new Date().toISOString()
});
  localStorage.setItem(
    "invoices",
    JSON.stringify(oldInvoices)
  );
}


export function getInvoices(): Invoice[] {
  return JSON.parse(
    localStorage.getItem("invoices") || "[]"
  );
}
export function updateInvoiceStatus(index: number, status: string) {
  const invoices = getInvoices();

  invoices[index].status = status;

  localStorage.setItem(
    "invoices",
    JSON.stringify(invoices)
  );
}
export function deleteInvoice(index: number) {

  const invoices = getInvoices();

  invoices.splice(index, 1);

  localStorage.setItem(
    "invoices",
    JSON.stringify(invoices)
  );

}
export function updateInvoice(
  index: number,
  updatedInvoice: any
) {

  const invoices = getInvoices();

  invoices[index] = updatedInvoice;

  localStorage.setItem(
    "invoices",
    JSON.stringify(invoices)
  );

}