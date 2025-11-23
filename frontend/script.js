const API_URL = "http://localhost:3000/workouts";

// --- Query Helper ---
function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// -------------------------
// DELETE CONFIRMATION MODAL
// -------------------------

let pendingDeleteId = null;

function showDeleteModal(id) {
  pendingDeleteId = id;
  document.getElementById("modalOverlay")?.classList.remove("hidden");
}

function hideDeleteModal() {
  pendingDeleteId = null;
  document.getElementById("modalOverlay")?.classList.add("hidden");
}

function initDeleteModal() {
  const overlay = document.getElementById("modalOverlay");
  if (!overlay) return;

  const confirmBtn = document.getElementById("confirmDelete");
  const cancelBtn = document.getElementById("cancelDelete");

  cancelBtn?.addEventListener("click", hideDeleteModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hideDeleteModal();
  });

  confirmBtn?.addEventListener("click", async () => {
    if (!pendingDeleteId) return;

    await fetch(`${API_URL}/${pendingDeleteId}`, { method: "DELETE" });
    hideDeleteModal();
    loadWorkouts();
  });
}

// -------------------------
// HOMEPAGE: LOAD WORKOUTS
// -------------------------

async function loadWorkouts() {
  try {
    const res = await fetch(API_URL);
    const workouts = await res.json();

    const list = document.getElementById("workoutList");
    if (!list) return;

    list.innerHTML = "";

    if (workouts.length === 0) {
      list.innerHTML = `<p class="empty-state">No workouts yet. Click “Add Workout” to get started.</p>`;
      return;
    }

    workouts.forEach((w) => {
      const card = document.createElement("div");
      card.className = "workout-card";

      const difficultyLabel = w.difficulty || "Not set";

      card.innerHTML = `
        <div class="workout-thumb">
          <img src="${w.imageUrl || 'images/default.jpg'}" class="thumb-img" />
        </div>

        <div class="workout-body">
          <h3>${w.name}</h3>
          <p class="meta">
            <span><strong>Muscle Group:</strong> ${w.muscleGroup}</span>
            <span><strong>Difficulty:</strong> ${difficultyLabel}</span>
          </p>
          <p class="description">${w.description || ""}</p>

          <div class="workout-actions">
            <button class="btn btn-small btn-green" data-edit-id="${w._id}">
              Edit Workout
            </button>

            <button class="btn btn-small btn-red" data-delete-id="${w._id}">
              Delete Workout
            </button>
          </div>
        </div>
      `;

      list.appendChild(card);
    });

    // Wire Edit buttons
    list.querySelectorAll("[data-edit-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit-id");
        window.location.href = `edit.html?id=${id}`;
      });
    });

    // Wire Delete buttons
    list.querySelectorAll("[data-delete-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-delete-id");
        showDeleteModal(id);
      });
    });
  } catch (err) {
    console.error("Error loading workouts:", err);
  }
}

// -------------------------
// ADD PAGE: CREATE
// -------------------------

function initAddForm() {
  const form = document.getElementById("addForm");
  if (!form) return;

  document.getElementById("cancelAdd")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const workout = {
      name: document.getElementById("name").value.trim(),
      muscleGroup: document.getElementById("muscleGroup").value.trim(),
      difficulty: document.getElementById("difficulty").value,
      description: document.getElementById("description").value.trim(),
      imageUrl: document.getElementById("imageUrl").value.trim(),
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    });

    window.location.href = "index.html";
  });
}

// -------------------------
// EDIT PAGE: UPDATE
// -------------------------

async function initEditForm() {
  const form = document.getElementById("editForm");
  if (!form) return;

  document.getElementById("cancelEdit")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const id = getIdFromQuery();
  if (!id) {
    alert("No workout id provided.");
    window.location.href = "index.html";
    return;
  }

  const res = await fetch(`${API_URL}/${id}`);
  const workout = await res.json();

  document.getElementById("name").value = workout.name || "";
  document.getElementById("muscleGroup").value = workout.muscleGroup || "";
  document.getElementById("difficulty").value = workout.difficulty || "";
  document.getElementById("description").value = workout.description || "";
  document.getElementById("imageUrl").value = workout.imageUrl || "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      name: document.getElementById("name").value.trim(),
      muscleGroup: document.getElementById("muscleGroup").value.trim(),
      difficulty: document.getElementById("difficulty").value,
      description: document.getElementById("description").value.trim(),
      imageUrl: document.getElementById("imageUrl").value.trim(),
    };

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    window.location.href = "index.html";
  });
}

// -------------------------
// ROUTING
// -------------------------

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "home") {
    initDeleteModal();
    loadWorkouts();
  } else if (page === "add") {
    initAddForm();
  } else if (page === "edit") {
    initEditForm();
  }
});
