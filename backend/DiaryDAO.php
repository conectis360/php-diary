<?php

class DiaryDAO
{
    private $pdo;
    private $dbPath;

    public function __construct(string $dbFileName = 'diario.sqlite')
    {
        // O caminho será relativo à pasta 'backend' onde este script está.
        $this->dbPath = __DIR__ . '/' . $dbFileName;
        $this->connect();
        $this->createTableIfNotExists();
    }

    private function connect()
    {
        try {
            $this->pdo = new PDO('sqlite:' . $this->dbPath);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Em um app real, logar o erro em vez de dar die()
            error_log("Erro de conexão com o BD: " . $e->getMessage());
            throw new Exception("Não foi possível conectar ao banco de dados.");
        }
    }

    private function createTableIfNotExists()
    {
        $sql = "
        CREATE TABLE IF NOT EXISTS entradas_diario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            texto TEXT NOT NULL,
            data_hora_criacao TEXT NOT NULL
        )";
        try {
            $this->pdo->exec($sql);
        } catch (PDOException $e) {
            error_log("Erro ao criar tabela: " . $e->getMessage());
            throw new Exception("Não foi possível criar a tabela no banco de dados.");
        }
    }

    public function salvarEntrada(string $titulo, string $texto, string $dataHora): bool
    {
        if (empty($titulo) || empty($texto)) {
            return false; // Validação básica
        }

        $sql = "INSERT INTO entradas_diario (titulo, texto, data_hora_criacao) VALUES (:titulo, :texto, :data_hora_criacao)";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':titulo', $titulo, PDO::PARAM_STR);
            $stmt->bindParam(':texto', $texto, PDO::PARAM_STR);
            $stmt->bindParam(':data_hora_criacao', $dataHora, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro ao salvar entrada: " . $e->getMessage() . " | Título: " . $titulo);
            return false;
        }
    }
}