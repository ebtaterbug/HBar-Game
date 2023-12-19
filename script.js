document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('refreshButton').addEventListener('click', function() {
        location.reload();
    });
    document.getElementById('toggleButtons').addEventListener('click', function() {
        var buttonContainer = document.querySelector('.button-container');

        if (buttonContainer.style.display === 'none') {
            buttonContainer.style.display = 'flex'; // Reappear
        } else {
            buttonContainer.style.display = 'none'; // Disappear
        }
    });
});
   