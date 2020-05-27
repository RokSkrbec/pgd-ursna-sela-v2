//textarea length for notifications
function count_it() {
  document.getElementById('counter').innerHTML = document.getElementById('text-area').value.length
}

count_it()

document.getElementById('file').onchange = function () {
  document.querySelector('.file-name').innerHTML = `Izbrana slika: ${this.value.replace('C:\\fakepath\\', '')}`
}
