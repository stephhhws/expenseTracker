export function getFormattedDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
// export function getFormattedDate(date) {
//   // console.log(date);  // Log the received Date object
//   const year = date.getFullYear();
//   const month = ('0' + (date.getMonth() + 1)).slice(-2);
//   const day = ('0' + date.getDate()).slice(-2);
//   return `${year}-${month}-${day}`;
// }

// export function getFormattedDate(date) {
//   return date.toISOString().slice(0, 10);
// }

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}