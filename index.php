<?php
date_default_timezone_set('America/Sao_Paulo'); // Defina seu fuso horário
// $currentDateTime = date('d/m/Y H:i:s'); // Não é mais usado diretamente aqui, o JS cuida disso
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Diário Digital</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="css/style.css">

    <script src="js/tinymce/tinymce.min.js" referrerpolicy="origin"></script>
</head>

<body>

    <div class="main-container">
        <div class="diary-wrapper">
            <div class="card">
                <div class="card-content">
                    <div id="clock-container">
                        <span id="date-display"></span>
                        <span id="time-display"></span>
                    </div>

                    <h5 class="center-align">Nova Entrada no Diário 📝</h5>

                    <form id="diaryForm">
                        <div class="input-field">
                            <input id="titulo" type="text" name="titulo" class="validate" required>
                            <label for="titulo">Título da sua entrada</label>
                        </div>

                        <div class="input-field textarea-container">
                            <textarea id="texto" name="texto" placeholder="Escreva seus pensamentos aqui..."></textarea>
                        </div>

                        <div class="center-align form-actions">
                            <button class="btn waves-effect waves-light deep-purple lighten-1" type="submit"
                                name="action">
                                Salvar
                                <i class="material-icons right">save</i>
                            </button>
                        </div>
                        <div id="feedback-message" class="center-align"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="js/app.js"></script>
</body>

</html>