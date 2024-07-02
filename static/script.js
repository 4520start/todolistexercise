const deleteForms = document.querySelectorAll(".delete-form");

for (const deleteForm of deleteForms) {
  deleteForm.onsubmit = (e) => {
    if (!window.confirm("本当に削除しますか？")) {
      e.preventDefault();
    }
  };
}
