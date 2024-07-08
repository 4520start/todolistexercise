const deleteForms = document.querySelectorAll(".delete-form");

for (const deleteForm of deleteForms) {
  deleteForm.onsubmit = (e) => {
    if (!window.confirm("本当に削除しますか？")) {
      e.preventDefault();
    }
  };
}

const editForms = document.querySelectorAll(".edit-form");

for (const editForm of editForms) {
  editForm.onsubmit = (e) => {
    if (!window.confirm("本当に編集しますか？")) {
      e.preventDefault();
    }
  };
}