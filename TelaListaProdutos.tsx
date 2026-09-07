import { useMemo, useRef, useState } from 'react';
import { Keyboard, TextInput, TouchableOpacity, Text, View, FlatList, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

export type Produto = {
  id: number;
  nome: string;
  preco: string;
  descricao?: string;
  imagem?: number;
  quantidade?: number;
};

export const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: 'Cadeira Confort Plus',
    preco: 'R$ 349,90',
    descricao: 'Cadeira ergonômica estofada, ideal para home office. Estrutura reforçada e altura regulável.',
    imagem: require('./assets/produto-cadeira.png'),
    quantidade: 12,
  },
  {
    id: 2,
    nome: 'Mesa Escritório Slim',
    preco: 'R$ 459,00',
    descricao: 'Mesa compacta com acabamento em MDF, ideal para espaços pequenos.',
    imagem: require('./assets/produto-mesa.png'),
    quantidade: 10,
  },
  {
    id: 3,
    nome: 'Luminária de Mesa LED',
    preco: 'R$ 89,90',
    descricao: 'Luminária com 3 níveis de intensidade e braço flexível.',
    imagem: require('./assets/produto-luminaria.png'),
    quantidade: 8,
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'> & {
  produtos: Produto[];
  onAdicionarProduto: (produto: Produto) => void;
};

function TelaListaProdutos({ navigation, produtos, onAdicionarProduto }: Props) {
  const [busca, setBusca] = useState('');
  const produtosFiltrados = useMemo(
    () => produtos.filter((item) => item.nome.toLowerCase().includes(busca.toLowerCase())),
    [produtos, busca]
  );

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const inputPrecoRef = useRef<TextInput>(null);
  const [quantidade, setQuantidade] = useState('');
  const inputQuantidadeRef = useRef<TextInput>(null);
  const [descricao, setDescricao] = useState('');
  const inputDescricaoRef = useRef<TextInput>(null);

  function validarESalvar() {
    if (nome.trim() === '') {
      setErro('O nome não pode ficar vazio!');
      return;
    }

    const precoNumerico = Number(preco.trim().replace(',', '.'));

    if (preco.trim() === '' || isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro('O preço precisa ser um número maior que zero!');
      return;
    }

    const quantidadeNumerica = Number(quantidade.trim());
      if (
        quantidade.trim() === '' ||
        isNaN(quantidadeNumerica) ||
        quantidadeNumerica < 0 ||
        !Number.isInteger(quantidadeNumerica)
      ) {
        setErro('A quantidade em estoque deve ser um número inteiro!');
        return;
    }

    onAdicionarProduto({
      id: Date.now(),
      nome,
      preco: `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`,
      descricao: descricao.trim() !== '' ? descricao : 'Sem descrição.',
      imagem: require('./assets/produto-suporte.png'),
      quantidade: quantidadeNumerica,
    });

    setNome('');
    setPreco('');
    setQuantidade('');
    setDescricao('');
    setErro('');
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>

      <View style={styles.cadastro}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar produto..."
          value={busca}
          onChangeText={setBusca}
        />

        <TextInput
          style={styles.input}
          placeholder="Nome do novo produto"
          value={nome}
          onChangeText={setNome}
          returnKeyType="next"
          onSubmitEditing={() => inputPrecoRef.current?.focus()}
        />

        <TextInput
          ref={inputPrecoRef}
          style={styles.input}
          placeholder="Preço"
          value={preco}
          onChangeText={setPreco}
          keyboardType="decimal-pad"
          returnKeyType="next"
          onSubmitEditing={() => inputQuantidadeRef.current?.focus()}
        />

        <TextInput
          ref={inputQuantidadeRef}
          style={styles.input}
          placeholder="Quantidade em estoque"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
          returnKeyType="next"
          onSubmitEditing={() => inputDescricaoRef.current?.focus()}
        />

        <TextInput
          ref={inputDescricaoRef}
          style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]} // Deixamos o campo mais alto
          placeholder="Descrição do produto (opcional)"
          value={descricao}
          onChangeText={setDescricao}
          multiline={true}
        />

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        <TouchableOpacity style={styles.botaoSalvar} onPress={validarESalvar}>
          <Text style={styles.textoBotaoSalvar}>Cadastrar produto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DetalheProduto', { produto: item })}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>{item.preco}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Estoque: {item.quantidade} unidades</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  inputBusca: {
    margin: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    fontSize: 16,
  },
  cadastro: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10
  },
  erro: {
    color: '#C62828',
    fontWeight: '500'
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  nome: {
    fontSize: 16,
    fontWeight: '600'
  },
  preco: {
    fontSize: 14,
    color: '#2E7D32'
  },
  botaoSalvar: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TelaListaProdutos;