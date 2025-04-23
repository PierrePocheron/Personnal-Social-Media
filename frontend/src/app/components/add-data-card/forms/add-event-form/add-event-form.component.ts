import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "@app/services/toast.service";
import { GraphReloadService } from "@src/app/services/graph-reload.service";

@Component({
  selector: "app-add-event-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./add-event-form.component.html",
  styleUrls: ["./add-event-form.component.scss"],
})
export class AddEventFormComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  title = "";
  type = "";
  location = "";
  description = "";
  startDate = "";
  endDate = "";

  private graphReload = inject(GraphReloadService)

  submit() {
    if (!this.title || !this.startDate || !this.endDate) {
      this.toast.error("Les champs obligatoires doivent être remplis");
      return;
    }

    const payload = {
      title: this.title,
      type: this.type,
      location: this.location,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      participants: [],
    };

    this.http.post("http://localhost:8080/api/events", payload).subscribe({
      next: () => {
        this.toast.success("✅ Événement ajouté avec succès");
        this.resetForm();
        this.graphReload.triggerReload();
      },
      error: () => {
        this.toast.error("❌ Une erreur est survenue lors de l’ajout");
      },
    });
  }

  resetForm() {
    this.title = "";
    this.type = "";
    this.location = "";
    this.description = "";
    this.startDate = "";
    this.endDate = "";
  }
}
