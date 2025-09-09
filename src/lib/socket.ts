// This file exports a MOCK socket object for demonstration purposes.
// It allows the frontend to work without a real socket server.

// A simple in-memory store for event listeners
const events: { [key: string]: ((data?: any) => void)[] } = {};
let intervalId: NodeJS.Timeout | null = null;

const notificationMessages = [
   "New job posted: Senior Frontend Developer",
   "Your application for 'UX Designer' was viewed",
   "Reminder: Interview tomorrow at 10 AM",
   "A new company 'Innovate Inc.' just signed up",
   "Your profile has a new view",
];

// The mock socket object that mimics the real socket.io-client API
export const socket = {
   /**
    * Subscribes to an event.
    * @param {string} event The name of the event.
    * @param {(data?: any) => void} callback The function to call when the event is emitted.
    */
   on(event: string, callback: (data?: any) => void) {
      if (!events[event]) {
         events[event] = [];
      }
      events[event].push(callback);
   },

   /**
    * Unsubscribes from an event.
    * @param {string} event The name of the event.
    */
   off(event: string) {
      events[event] = [];
   },

   /**
    * Simulates connecting to the server and starts the notification interval.
    */
   connect() {
      console.log("Mock Socket: Connected!");

      // Start emitting fake notifications every 10 seconds
      intervalId = setInterval(() => {
         if (events["new-notification"]) {
            const randomMessage =
               notificationMessages[
                  Math.floor(Math.random() * notificationMessages.length)
               ];
            // Emit the 'new-notification' event to all its listeners
            events["new-notification"].forEach((cb) =>
               cb({ message: randomMessage })
            );
         }
      }, 3000);
   },

   /**
    * Simulates disconnecting from the server and clears the interval.
    */
   disconnect() {
      console.log("Mock Socket: Disconnected!");
      if (intervalId) {
         clearInterval(intervalId);
         intervalId = null;
      }
   },
};
