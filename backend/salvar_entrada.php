<?php
header('Content-Type: application/json');
require_once 'DiaryDAO.php';

// Define o fuso horário para garantir consistência na data/hora
date_default_timezone_set('America/Sao_Paulo'); // Ou o fuso horário do seu servidor/aplicação

$response = ['success' => false, 'message' => 'Requisição inválida.'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE); // Decodifica como array associativo

    if (json_last_error() !== JSON_ERROR_NONE) {
        $response['message'] = 'Erro ao decodificar JSON: ' . json_last_error_msg();
        http_response_code(400); // Bad Request
        echo json_encode($response);
        exit;
    }

    $titulo = $input['titulo'] ?? null;
    $texto = $input['texto'] ?? null;

    if (empty(trim($titulo)) || empty(trim($texto))) {
        $response['message'] = 'Título e texto são obrigatórios.';
        http_response_code(400); // Bad Request
    } else {
        try {
            $dao = new DiaryDAO('diario.sqlite'); // O arquivo será criado em backend/diario.sqlite
            $dataHoraAtual = date('Y-m-d H:i:s'); // Formato ideal para SQLite DATETIME

            if ($dao->salvarEntrada($titulo, $texto, $dataHoraAtual)) {
                $response['success'] = true;
                $response['message'] = 'Entrada salva com sucesso!';
            } else {
                $response['message'] = 'Erro ao salvar a entrada no banco de dados.';
                http_response_code(500); // Internal Server Error
            }
        } catch (Exception $e) {
            error_log("Erro no controller: " . $e->getMessage());
            $response['message'] = 'Ocorreu um erro no servidor: ' . $e->getMessage();
            http_response_code(500); // Internal Server Error
        }
    }
} else {
    $response['message'] = 'Método não permitido.';
    http_response_code(405); // Method Not Allowed
}

echo json_encode($response);