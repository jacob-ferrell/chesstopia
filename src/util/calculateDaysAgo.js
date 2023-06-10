export default function calculateDaysAgo(dateTimeString) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
  
    const datetime = new Date(dateTimeString);
    datetime.setHours(0, 0, 0, 0); // Set time to midnight
  
    // Calculate the difference in milliseconds between the current date and the datetime
    const timeDiff = currentDate.getTime() - datetime.getTime();
  
    // Convert the time difference to days
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
    return daysAgo;
  }