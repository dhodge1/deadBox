<?php

function show_error() {
   global $_SESSION;

   if (isset($_SESSION['error'])) { 
      echo "<div class='error'>" . $_SESSION['error'] . "</div>"; 
      unset($_SESSION['error']); 
   }
}

?>