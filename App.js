import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [sessao, setSessao] = useState(null);
  const [ehCadastro, setEhCadastro] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) buscarUsuarios();
    });
  }, []);

  const buscarUsuarios = async () => {
    const { data: user, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error(authError.message);
      return;
    }

    const email = user?.user?.email;

    const { data, error } = await supabase
      .from('diario')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUsuarios(data);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      setSessao(session);
    };

    getSession();
  }, []);


  const salvarMensagem = async () => {
    if (titulo && mensagem) {
      const { data: user, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error(authError.message);
        return;
      }

      const email = user?.user?.email;

      const { data, error } = await supabase
        .from('diario')
        .insert([{
          titulo: titulo,
          mensagem: mensagem,
          email: email
        }]);

      if (error) {
        console.error(error);
      } else {
        setTitulo('');
        setMensagem('');
        buscarUsuarios();
      }
    }
  };

  const entrarComEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) alert(error.message);
  };

  const cadastrarComEmail = async () => {
    const { error } = await supabase.auth.signUp({ email, password: senha });

    if (error) alert(error.message);
  };

  const sair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  if (!sessao) {
    return (
      <ImageBackground source={require('./assets/fundo.jpg')} style={estilos.container}>
        <Text style={estilos.titulo}>Meu Diário</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {ehCadastro ? (
          <>
          <Text onPress={() => setEhCadastro(false)} style={estilos.ligacao}>Já tem uma conta? Entrar</Text>
            <TouchableOpacity style={estilos.botao} onPress={cadastrarComEmail}>
              <Text style={estilos.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
          <Text onPress={() => setEhCadastro(true)} style={estilos.ligacao}>Não tem uma conta? Cadastre-se</Text>
            <TouchableOpacity style={estilos.botao} onPress={entrarComEmail}>
              <Text style={estilos.textoBotao}>Entrar</Text>
            </TouchableOpacity>
          </>
        )}
      </ImageBackground>
    );
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo2}>Bem-vindo(a) ao seu Diário</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={estilos.entrada}
        placeholder="Mensagem"
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={estilos.botao} onPress={salvarMensagem}>
        <Text style={estilos.textoBotao}>Salvar Mensagem</Text>
      </TouchableOpacity>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.usuario}>
            <Text style={estilos.textoUsuario}>Título: {item.titulo}</Text>
            <Text style={estilos.textoUsuario}>Mensagem: {item.mensagem}</Text>
          </View>
        )}
        style={estilos.listaUsuarios}
      />
      <TouchableOpacity style={estilos.botao} onPress={sair}>
        <Text style={estilos.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30
  },
  titulo2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 70,
    marginBottom: 30
  },
  entrada: {
    width: '100%',
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#FA018A',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  ligacao: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  usuario: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  textoUsuario: {
    fontSize: 18,
    color: '#333',
  },
  listaUsuarios: {
    width: '100%',
    marginTop: 55,
  },
});