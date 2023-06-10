export default function formatDateTime(dateTime) {
  return { date: formatDate(dateTime), time: formatTime(dateTime) };
}

function formatDate(datetimeString) {
  const date = new Date(datetimeString);

  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${day}/${year}`;
}

function formatTime(datetimeString) {
    const time = new Date(datetimeString);
    
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    hours = String(hours);
    minutes = String(minutes).padStart(2, '0');
    
    return `${hours}:${minutes} ${ampm}`;
  }
