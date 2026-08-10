import { useState } from 'react';
import { FlatList, View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

export type Produto = {
  id: number;
  nome: string;
  preco: string;
  descricao?: string;
  imagem?: number;
};

export const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: 'Cadeira Confort Plus',
    preco: 'R$ 349,90',
    descricao: 'Cadeira ergonômica estofada, ideal para home office. Estrutura reforçada e altura regulável.',
    imagem: require('./assets/produto-cadeira.png'),
  },
  {
    id: 2,
    nome: 'Mesa Escritório Slim',
    preco: 'R$ 459,00',
    descricao: 'Mesa compacta com acabamento em MDF, ideal para espaços pequenos.',
    imagem: require('./assets/produto-mesa.png'),
  },
  {
    id: 3,
    nome: 'Luminária de Mesa LED',
    preco: 'R$ 89,90',
    descricao: 'Luminária com 3 níveis de intensidade e braço flexível.',
    imagem: require('./assets/produto-luminaria.png'),
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'>;

function TelaListaProdutos({ navigation }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');

  function validarESalvar() {
    if (nome.trim() === '') {
      setErro('O nome não pode ficar vazio.');
      return;
    }
    if (isNaN(Number(preco)) || Number(preco) <= 0) {
      setErro('O preço precisa ser um número maior que zero.');
      return;
    }
    const novoProduto: Produto = {
      id: Date.now(),
      nome,
      preco: `R$ ${Number(preco).toFixed(2)}`,
    };
    setProdutos([...produtos, novoProduto]);
    setNome('');
    setPreco('');
    setErro('');
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nome do produto" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
      <Button title="Salvar produto" onPress={validarESalvar} />
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DetalheProduto', { produto: item })}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>{item.preco}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8, padding: 10, marginBottom: 8 },
  erro: { color: '#C62828', marginBottom: 8 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  nome: { fontSize: 16, fontWeight: '600' },
  preco: { fontSize: 14, color: '#2E7D32' },
});

export default TelaListaProdutos;