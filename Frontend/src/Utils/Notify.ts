import { Notyf } from "notyf";

class Notify {

   // Main options:
   private notyf = new Notyf({
      duration: 3000,
      position: { x: "center", y: "center" },
      dismissible: true
   });

   // Success window
   public success(message: string): void {
      this.notyf.success(message);
   }

   // Error window:
   public error(err: any): void {
      const message = this.extractErrorMessage(err);
      this.notyf.error(message);
   }

   // All error types:
   private extractErrorMessage(err: any): string {
      if (typeof err === "string") return err;
      if (typeof err.response?.data === "string") return err.response.data;
      if (typeof err.message === "string") return err.message;
      return "Some error, please try again"
   }

}

const notify = new Notify();

export default notify;
