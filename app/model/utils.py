import fitz
import os
from typing import Dict, List
from pathlib import Path
from langdetect import detect
from app.model.config import DOCUMENTS_DIR

def carregar_pdfs (pasta: Path = DOCUMENTS_DIR) -> Dict[str, str]:
    """Carrega todos os PDFs de uma pasta"""
    textos = {}
    try:
        if not os.path.exists(pasta):
            print(f"A pasta '{pasta}' não foi encontrada.")
            return textos
        
        for arquivo in os.listdir(pasta):
            if arquivo.endswith('.pdf'):
                caminho = os.path.join(pasta, arquivo)
                try:
                    documento = fitz.open(caminho)
                    texto = ""
                    for pagina in documento:
                        texto += pagina.get_text()
                    textos[arquivo] = texto
                except Exception as e:
                    print(f"Erro ao ler o arquivo {arquivo}: {e}")
                
    except Exception as e:
        print(f"Erro ao carregar PDFs: {e}")
    return textos

def buscar_resposta(textos: Dict[str, str], pergunta: str) -> List[str]:
    """Busca respostas nos PDFs carregados"""
    respostas_encontradas = []
    for arquivo, texto in textos.items():
        if pergunta.lower() in texto.lower():
            respostas_encontradas.append(
                f"Resposta encontrada no arquivo {arquivo}: {texto[:100]}..."
            )
        return respostas_encontradas if respostas_encontradas else ["Nenhuma resposta encontrada."]
    
def detectar_idioma(texto: str) -> str:
    """Detecta o idioma do texto"""
    try:
        return detect(texto)
    except:
        return 'en'
    

def get_system_prompt() -> str:
    """Retorna prompt do sistema"""
    return '''
    identidade:
        nome: Ina
        descrição: >
        Ina é a Inteligência Artificial da Opuspac University, braço acadêmico da empresa Opuspac.
        Características: inteligente, delicada, simpática, proativa e assertiva.
'''