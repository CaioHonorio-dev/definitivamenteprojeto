/* ==================== VARIÁVEIS GLOBAIS ==================== */
        let usuarioTipo = ''; // Armazena o tipo de usuário: 'usuaria' ou 'empregador'
        let usuarioNome = ''; // Armazena o nome do usuário
        let usuarioEmail = ''; // Armazena o e-mail do usuário

        // Lista de domínios de e-mail válidos
        const dominiosValidos = [
            'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 
            'yahoo.com', 'icloud.com', 'live.com', 'uol.com.br',
            'bol.com.br', 'terra.com.br', 'ig.com.br'
        ];

        /* ==================== FUNÇÕES DE VALIDAÇÃO ==================== */
        
        /**
         * Valida se o e-mail possui um formato correto E um domínio válido
         * @param {string} email - E-mail a ser validado
         * @returns {boolean} - True se o e-mail for válido
         */
        function validarEmail(email) {
            // Verifica formato básico do e-mail
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(email)) {
                return false;
            }
            
            // Extrai o domínio do e-mail (parte após o @)
            const dominio = email.split('@')[1];
            
            // Verifica se o domínio está na lista de domínios válidos
            return dominiosValidos.includes(dominio.toLowerCase());
        }

        /**
         * Valida se a senha tem no mínimo 6 caracteres
         * @param {string} senha - Senha a ser validada
         * @returns {boolean} - True se a senha for válida
         */
        function validarSenha(senha) {
            return senha.length >= 6;
        }

        /**
         * Verifica a força da senha e atualiza a barra visual
         * Fraca: < 6 caracteres
         * Média: 6-9 caracteres
         * Forte: >= 10 caracteres
         */
        function verificarForcaSenha() {
            const senha = document.getElementById('cadastroSenha').value;
            const bar = document.getElementById('senhaStrengthBar');
            
            // Remove todas as classes anteriores
            bar.className = 'password-strength-bar';
            
            if (senha.length === 0) {
                bar.style.width = '0';
            } else if (senha.length < 6) {
                bar.classList.add('weak');
            } else if (senha.length < 10) {
                bar.classList.add('medium');
            } else {
                bar.classList.add('strong');
            }
        }

        /**
         * Mostra ou esconde mensagem de erro em um campo
         * @param {string} campoId - ID do campo input
         * @param {string} mensagemId - ID da mensagem de erro
         * @param {boolean} mostrar - Se deve mostrar ou esconder o erro
         */
        function mostrarErro(campoId, mensagemId, mostrar = true) {
            const campo = document.getElementById(campoId);
            const mensagem = document.getElementById(mensagemId);
            
            if (mostrar) {
                campo.classList.add('error');
                mensagem.classList.add('show');
            } else {
                campo.classList.remove('error');
                mensagem.classList.remove('show');
            }
        }

        /**
         * Exibe uma notificação temporária na tela
         * @param {string} texto - Texto da notificação
         * @param {string} tipo - Tipo: 'success' ou 'error'
         */
        function mostrarNotificacao(texto, tipo = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = texto;
            notification.className = `notification ${tipo} show`;
            
            // Remove a notificação após 4 segundos
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        /* ==================== VALIDAÇÕES DE FORMULÁRIOS ==================== */
        
        /**
         * Valida o formulário de login
         * Verifica e-mail e senha antes de prosseguir
         */
        function validarLogin() {
            const email = document.getElementById('loginEmail').value.trim();
            const senha = document.getElementById('loginSenha').value;
            
            let valido = true;
            
            // Valida e-mail com domínio válido
            if (!validarEmail(email)) {
                mostrarErro('loginEmail', 'loginEmailError');
                valido = false;
            } else {
                mostrarErro('loginEmail', 'loginEmailError', false);
            }
            
            // Valida senha
            if (!validarSenha(senha)) {
                mostrarErro('loginSenha', 'loginSenhaError');
                valido = false;
            } else {
                mostrarErro('loginSenha', 'loginSenhaError', false);
            }
            
            // Se tudo estiver válido, avança para escolha de tipo de usuário
            if (valido) {
                usuarioEmail = email;
                escolherTipoUsuario();
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos corretamente.', 'error');
            }
        }

        /**
         * Valida o formulário de cadastro
         * Verifica nome, e-mail, senha e confirmação de senha
         */
        function validarCadastro() {
            const nome = document.getElementById('cadastroNome').value.trim();
            const email = document.getElementById('cadastroEmail').value.trim();
            const senha = document.getElementById('cadastroSenha').value;
            const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value;
            
            let valido = true;
            
            // Valida nome (mínimo 3 caracteres)
            if (nome.length < 3) {
                mostrarErro('cadastroNome', 'cadastroNomeError');
                valido = false;
            } else {
                mostrarErro('cadastroNome', 'cadastroNomeError', false);
            }
            
            // Valida e-mail com domínio válido
            if (!validarEmail(email)) {
                mostrarErro('cadastroEmail', 'cadastroEmailError');
                valido = false;
            } else {
                mostrarErro('cadastroEmail', 'cadastroEmailError', false);
            }
            
            // Valida senha
            if (!validarSenha(senha)) {
                mostrarErro('cadastroSenha', 'cadastroSenhaError');
                valido = false;
            } else {
                mostrarErro('cadastroSenha', 'cadastroSenhaError', false);
            }
            
            // Valida confirmação de senha
            if (senha !== confirmaSenha) {
                mostrarErro('cadastroConfirmaSenha', 'confirmarSenhaError');
                valido = false;
            } else {
                mostrarErro('cadastroConfirmaSenha', 'confirmarSenhaError', false);
            }
            
            // Se tudo estiver válido, salva dados e avança
            if (valido) {
                usuarioNome = nome;
                usuarioEmail = email;
                escolherTipoUsuario();
            } else {
                mostrarNotificacao('Por favor, corrija os erros no formulário.', 'error');
            }
        }

        /**
         * Valida os dados específicos da usuária
         * Verifica área de interesse, nível de experiência e telefone
         */
        function validarDadosUsuaria() {
            const area = document.getElementById('areaInteresse').value;
            const nivel = document.getElementById('nivelExp').value;
            const telefone = document.getElementById('telefone').value;
            
            let valido = true;
            
            // Valida seleção de área
            if (!area) {
                mostrarErro('areaInteresse', 'areaInteresseError');
                valido = false;
            } else {
                mostrarErro('areaInteresse', 'areaInteresseError', false);
            }
            
            // Valida seleção de nível
            if (!nivel) {
                mostrarErro('nivelExp', 'nivelExpError');
                valido = false;
            } else {
                mostrarErro('nivelExp', 'nivelExpError', false);
            }
            
            // Valida telefone (deve estar formatado com pelo menos 14 caracteres)
            if (telefone.length < 14) {
                mostrarErro('telefone', 'telefoneError');
                valido = false;
            } else {
                mostrarErro('telefone', 'telefoneError', false);
            }
            
            // Se tudo estiver válido, entra na plataforma
            if (valido) {
                entrarPlataforma();
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        }

        /**
         * Valida os dados específicos do empregador
         * Verifica nome da empresa, CNPJ e setor
         */
        function validarDadosEmpregador() {
            const nomeEmpresa = document.getElementById('nomeEmpresa').value.trim();
            const cnpj = document.getElementById('cnpj').value;
            const setor = document.getElementById('setor').value;
            
            let valido = true;
            
            // Valida nome da empresa (mínimo 3 caracteres)
            if (nomeEmpresa.length < 3) {
                mostrarErro('nomeEmpresa', 'nomeEmpresaError');
                valido = false;
            } else {
                mostrarErro('nomeEmpresa', 'nomeEmpresaError', false);
            }
            
            // Valida CNPJ (deve estar formatado com 18 caracteres)
            if (cnpj.length < 18) {
                mostrarErro('cnpj', 'cnpjError');
                valido = false;
            } else {
                mostrarErro('cnpj', 'cnpjError', false);
            }
            
            // Valida seleção de setor
            if (!setor) {
                mostrarErro('setor', 'setorError');
                valido = false;
            } else {
                mostrarErro('setor', 'setorError', false);
            }
            
            // Se tudo estiver válido, entra na plataforma
            if (valido) {
                entrarPlataforma();
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        }

        /* ==================== FORMATAÇÃO DE CAMPOS ==================== */
        
        /**
         * Formata o telefone automaticamente enquanto o usuário digita
         * Formato: (00) 00000-0000
         * @param {HTMLElement} input - Campo de input do telefone
         */
        function formatarTelefone(input) {
            // Remove tudo que não é número
            let valor = input.value.replace(/\D/g, '');
            
            // Aplica a máscara de telefone
            if (valor.length <= 11) {
                valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                valor = valor.replace(/^(\d*)/, '($1');
            }
            
            input.value = valor;
        }

        /**
         * Formata o CNPJ automaticamente enquanto o usuário digita
         * Formato: 00.000.000/0000-00
         * @param {HTMLElement} input - Campo de input do CNPJ
         */
        function formatarCNPJ(input) {
            // Remove tudo que não é número
            let valor = input.value.replace(/\D/g, '');
            
            // Aplica a máscara de CNPJ
            if (valor.length <= 14) {
                valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
                valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
                valor = valor.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
                valor = valor.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
            }
            
            input.value = valor;
        }

        /* ==================== NAVEGAÇÃO ENTRE FORMULÁRIOS ==================== */
        
        /**
         * Exibe o formulário de login e esconde o de cadastro
         */
        function mostrarLogin() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('cadastroForm').classList.add('hidden');
            limparErros();
        }

        /**
         * Exibe o formulário de cadastro e esconde o de login
         */
        function mostrarCadastro() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('cadastroForm').classList.remove('hidden');
            limparErros();
        }

        /**
         * Remove todas as mensagens de erro e classes de erro dos campos
         */
        function limparErros() {
            document.querySelectorAll('.error-message').forEach(msg => {
                msg.classList.remove('show');
            });
            document.querySelectorAll('.error').forEach(campo => {
                campo.classList.remove('error');
            });
        }

        /**
         * Exibe a tela de escolha do tipo de usuário
         */
        function escolherTipoUsuario() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('cadastroForm').classList.add('hidden');
            document.getElementById('tipoUsuarioForm').classList.remove('hidden');
            limparErros();
        }

        /**
         * Define o tipo como usuária e exibe formulário de dados
         */
        function preencherDadosUsuaria() {
            usuarioTipo = 'usuaria';
            document.getElementById('tipoUsuarioForm').classList.add('hidden');
            document.getElementById('dadosUsuariaForm').classList.remove('hidden');
        }

        /**
         * Define o tipo como empregador e exibe formulário de dados
         */
        function preencherDadosEmpregador() {
            usuarioTipo = 'empregador';
            document.getElementById('tipoUsuarioForm').classList.add('hidden');
            document.getElementById('dadosEmpregadorForm').classList.remove('hidden');
        }

        /* ==================== ENTRADA NA PLATAFORMA ==================== */
        
        /**
         * Finaliza o cadastro/login e exibe a plataforma principal
         * Configura interface específica para cada tipo de usuário
         */
        function entrarPlataforma() {
            const nome = usuarioNome || 'Usuária';
            
            // Esconde tela de login e exibe plataforma
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainPlatform').style.display = 'block';
            
            // Define inicial do usuário no ícone
            document.getElementById('userIcon').textContent = nome.charAt(0).toUpperCase();

            // Configurações específicas para empregador
            if (usuarioTipo === 'empregador') {
                document.getElementById('vagasDescricao').textContent = 'Divulgue suas vagas e encontre talentos';
                document.getElementById('divulgarVagaForm').classList.remove('hidden');
                document.getElementById('minhasVagasDesc').textContent = 'Gerencie suas vagas publicadas';
            }

            // Exibe notificação de boas-vindas
            mostrarNotificacao(`Bem-vinda, ${nome}! `, 'success');
        }

        /* ==================== NAVEGAÇÃO ENTRE ABAS ==================== */
        
        /**
         * Exibe uma aba específica e esconde as outras
         * Atualiza o menu de navegação para destacar a aba ativa
         * @param {string} aba - ID da aba a ser exibida
         */
        function mostrarAba(aba) {
            // Esconde todas as abas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Exibe a aba selecionada
            document.getElementById(aba).classList.add('active');

            // Atualiza destaque do menu
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Destaca o link clicado
            if (event && event.target) {
                event.target.classList.add('active');
            }
        }

        /**
         * Alterna a exibição do menu dropdown do usuário
         */
        function toggleDropdown() {
            document.querySelector('.dropdown').classList.toggle('active');
        }

        /* ==================== FUNCIONALIDADES DA PLATAFORMA ==================== */
        
        /**
         * Exibe detalhes completos de um curso
         * @param {string} curso - Identificador do curso
         */
        function verDetalhes(curso) {
            const detalhes = {
                web: 'Curso completo de Desenvolvimento Web Full Stack. Inclui: HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, MongoDB. Projetos práticos e certificado ao final.',
                data: 'Formação completa em Ciência de Dados. Conteúdo: Python, Pandas, NumPy, Scikit-learn, TensorFlow, visualização de dados, estatística aplicada.',
                ux: 'Curso de UX/UI Design. Aprenda: Design Thinking, Pesquisa com usuários, Wireframes, Prototipação em Figma, Testes de usabilidade, Design System.',
                sec: 'Formação em Segurança da Informação. Módulos: Fundamentos de segurança, Ethical Hacking, Criptografia, Análise de vulnerabilidades, Resposta a incidentes.'
            };
            mostrarNotificacao(detalhes[curso], 'success');
        }

        /**
         * Processa candidatura a uma vaga
         * @param {string} vaga - Identificador da vaga
         */
        function candidatar(vaga) {
            mostrarNotificacao('Candidatura enviada com sucesso! Você receberá um e-mail com os próximos passos. 💜', 'success');
        }

        /**
         * Processa entrada em uma comunidade
         * @param {string} comunidade - Identificador da comunidade
         */
        function entrarComunidade(comunidade) {
            mostrarNotificacao('Bem-vinda à comunidade! Você já pode começar a interagir com outras mulheres em TI. 💜', 'success');
        }

        /**
         * Publica uma nova vaga (apenas para empregadores)
         * Valida todos os campos antes de publicar
         */
        function publicarVaga() {
            const titulo = document.getElementById('tituloVaga').value.trim();
            const descricao = document.getElementById('descricaoVaga').value.trim();
            const local = document.getElementById('localVaga').value.trim();
            
            let valido = true;
            
            // Valida título
            if (!titulo) {
                mostrarErro('tituloVaga', 'tituloVagaError');
                valido = false;
            } else {
                mostrarErro('tituloVaga', 'tituloVagaError', false);
            }
            
            // Valida descrição
            if (!descricao) {
                mostrarErro('descricaoVaga', 'descricaoVagaError');
                valido = false;
            } else {
                mostrarErro('descricaoVaga', 'descricaoVagaError', false);
            }
            
            // Valida localização
            if (!local) {
                mostrarErro('localVaga', 'localVagaError');
                valido = false;
            } else {
                mostrarErro('localVaga', 'localVagaError', false);
            }
            
            // Se tudo válido, publica e limpa formulário
            if (valido) {
                mostrarNotificacao('Vaga publicada com sucesso! Em breve aparecerá na lista de oportunidades. 💜', 'success');
                document.getElementById('tituloVaga').value = '';
                document.getElementById('descricaoVaga').value = '';
                document.getElementById('localVaga').value = '';
            } else {
                mostrarNotificacao('Por favor, preencha todos os campos da vaga.', 'error');
            }
        }

        /**
         * Salva alterações do perfil do usuário
         */
        function salvarPerfil() {
            mostrarNotificacao('Perfil atualizado com sucesso! ', 'success');
        }

        /**
         * Processa assinatura de um plano
         * @param {string} plano - Tipo do plano (premium, empresarial)
         */
        function assinarPlano(plano) {
            mostrarNotificacao(`Redirecionando para pagamento do plano ${plano}...`, 'success');
        }

        /**
         * Realiza logout do usuário e volta para tela de login
         */
        function sair() {
            if (confirm('Deseja realmente sair?')) {
                // Esconde plataforma e exibe tela de login
                document.getElementById('mainPlatform').style.display = 'none';
                document.getElementById('loginScreen').style.display = 'flex';
                
                // Reseta todos os formulários para estado inicial
                document.getElementById('loginForm').classList.remove('hidden');
                document.getElementById('cadastroForm').classList.add('hidden');
                document.getElementById('tipoUsuarioForm').classList.add('hidden');
                document.getElementById('dadosUsuariaForm').classList.add('hidden');
                document.getElementById('dadosEmpregadorForm').classList.add('hidden');
                
                // Limpa erros
                limparErros();
                
                // Exibe mensagem de despedida
                mostrarNotificacao('Até breve! ', 'success');
            }
        }

        /* ==================== EVENT LISTENERS ==================== */
        
        /**
         * Fecha o dropdown ao clicar fora dele
         */
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.dropdown')) {
                document.querySelector('.dropdown').classList.remove('active');
            }
        });

        /**
         * Remove erros automaticamente quando o usuário começa a digitar
         * Melhora a experiência do usuário
         */
        document.addEventListener('input', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
                const errorId = event.target.id + 'Error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    event.target.classList.remove('error');
                    errorElement.classList.remove('show');
                }
            }
        });
          /**
         * Exibe uma aba específica e esconde as outras
         * Atualiza o menu de navegação para destacar a aba ativa
         * @param {string} aba - ID da aba a ser exibida
         */
        function mostrarAba(aba) {
            // Esconde todas as abas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Exibe a aba selecionada
            document.getElementById(aba).classList.add('active');

            // Atualiza destaque do menu - Remove active de todos os links
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Adiciona active ao link correspondente à aba atual
            document.querySelectorAll('.nav-menu a').forEach(link => {
                // Verifica qual aba corresponde ao onclick do link
                const onclickAttr = link.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes(`'${aba}'`)) {
                    link.classList.add('active');
                }
            });
        }

        /* ==================== FUNÇÕES PARA ÁREA DO EMPREGADOR ==================== */
/* Cole este código NO FINAL do arquivo codigo.js (antes do comentário final) */

/**
 * Alterna entre as seções do dashboard do empregador
 * @param {string} secao - ID da seção a ser exibida
 */
function mostrarSecaoEmpregador(secao) {
    // Esconde todas as seções do empregador
    document.querySelectorAll('.content-section-emp').forEach(section => {
        section.classList.remove('active');
    });
    
    // Exibe a seção selecionada
    document.getElementById(secao).classList.add('active');
    
    // Atualiza os botões do menu
    document.querySelectorAll('.nav-btn-emp').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona classe active ao botão clicado
    event.target.classList.add('active');
}

/**
 * Alterna entre os campos de vaga e curso no formulário de publicação
 */
function alternarCamposPublicacao() {
    const tipo = document.getElementById('tipoPublicacaoEmp').value;
    const camposVaga = document.getElementById('camposVagaEmp');
    const camposCurso = document.getElementById('camposCursoEmp');
    
    if (tipo === 'vaga') {
        camposVaga.style.display = 'block';
        camposCurso.style.display = 'none';
    } else {
        camposVaga.style.display = 'none';
        camposCurso.style.display = 'block';
    }
}

/**
 * Aprova um pedido recebido
 * @param {number} idPedido - ID do pedido a ser aprovado
 */
function aprovarPedido(idPedido) {
    if (confirm('Deseja aprovar este pedido?')) {
        mostrarNotificacao(`Pedido #${idPedido} aprovado com sucesso! A solicitante será notificada. ✓`, 'success');
        
        // Atualiza o status visualmente (simulação)
        const pedidoCard = event.target.closest('.pedido-card');
        const statusBadge = pedidoCard.querySelector('.pedido-status');
        statusBadge.textContent = '✓ Aprovado';
        statusBadge.className = 'pedido-status status-aprovado';
        
        // Remove os botões de ação
        const acoesDiv = pedidoCard.querySelector('.acoes-pedido');
        if (acoesDiv) {
            acoesDiv.remove();
        }
    }
}

/**
 * Rejeita um pedido recebido
 * @param {number} idPedido - ID do pedido a ser rejeitado
 */
function rejeitarPedido(idPedido) {
    const motivo = prompt('Deseja informar o motivo da rejeição? (opcional)');
    
    if (motivo !== null) { // null significa que cancelou
        mostrarNotificacao(`Pedido #${idPedido} rejeitado. A solicitante será notificada. ✗`, 'error');
        
        // Atualiza o status visualmente (simulação)
        const pedidoCard = event.target.closest('.pedido-card');
        const statusBadge = pedidoCard.querySelector('.pedido-status');
        statusBadge.textContent = '✗ Rejeitado';
        statusBadge.className = 'pedido-status status-rejeitado';
        
        // Remove os botões de ação
        const acoesDiv = pedidoCard.querySelector('.acoes-pedido');
        if (acoesDiv) {
            acoesDiv.remove();
        }
    }
}

/**
 * Valida e publica uma nova vaga ou curso
 */
function publicarConteudoEmpregador() {
    const tipo = document.getElementById('tipoPublicacaoEmp').value;
    let valido = true;
    
    if (tipo === 'vaga') {
        // Validação de vaga de emprego
        const titulo = document.getElementById('tituloVagaEmp').value.trim();
        const nomeEmpresa = document.getElementById('nomeEmpresaEmp').value.trim();
        const descricao = document.getElementById('descricaoVagaEmp').value.trim();
        const localizacao = document.getElementById('localizacaoVagaEmp').value.trim();
        const contato = document.getElementById('contatoPublicacaoEmp').value.trim();
        
        // Valida título
        if (!titulo) {
            mostrarErro('tituloVagaEmp', 'tituloVagaEmpError');
            valido = false;
        } else {
            mostrarErro('tituloVagaEmp', 'tituloVagaEmpError', false);
        }
        
        // Valida nome da empresa
        if (!nomeEmpresa) {
            mostrarErro('nomeEmpresaEmp', 'nomeEmpresaEmpError');
            valido = false;
        } else {
            mostrarErro('nomeEmpresaEmp', 'nomeEmpresaEmpError', false);
        }
        
        // Valida descrição
        if (!descricao) {
            mostrarErro('descricaoVagaEmp', 'descricaoVagaEmpError');
            valido = false;
        } else {
            mostrarErro('descricaoVagaEmp', 'descricaoVagaEmpError', false);
        }
        
        // Valida localização
        if (!localizacao) {
            mostrarErro('localizacaoVagaEmp', 'localizacaoVagaEmpError');
            valido = false;
        } else {
            mostrarErro('localizacaoVagaEmp', 'localizacaoVagaEmpError', false);
        }
        
        // Valida contato
        if (!contato) {
            mostrarErro('contatoPublicacaoEmp', 'contatoPublicacaoEmpError');
            valido = false;
        } else {
            mostrarErro('contatoPublicacaoEmp', 'contatoPublicacaoEmpError', false);
        }
        
        if (valido) {
            mostrarNotificacao('✓ Vaga de emprego publicada com sucesso! Em breve aparecerá na plataforma. 💼', 'success');
            limparFormularioPublicacao();
        } else {
            mostrarNotificacao('⚠️ Por favor, preencha todos os campos obrigatórios.', 'error');
        }
        
    } else if (tipo === 'curso') {
        // Validação de curso
        const nomeCurso = document.getElementById('nomeCursoEmp').value.trim();
        const instituicao = document.getElementById('instituicaoCursoEmp').value.trim();
        const descricao = document.getElementById('descricaoCursoEmp').value.trim();
        const cargaHoraria = document.getElementById('cargaHorariaCursoEmp').value.trim();
        const dataInicio = document.getElementById('dataInicioCursoEmp').value;
        const contato = document.getElementById('contatoPublicacaoEmp').value.trim();
        
        // Valida nome do curso
        if (!nomeCurso) {
            mostrarErro('nomeCursoEmp', 'nomeCursoEmpError');
            valido = false;
        } else {
            mostrarErro('nomeCursoEmp', 'nomeCursoEmpError', false);
        }
        
        // Valida instituição
        if (!instituicao) {
            mostrarErro('instituicaoCursoEmp', 'instituicaoCursoEmpError');
            valido = false;
        } else {
            mostrarErro('instituicaoCursoEmp', 'instituicaoCursoEmpError', false);
        }
        
        // Valida descrição
        if (!descricao) {
            mostrarErro('descricaoCursoEmp', 'descricaoCursoEmpError');
            valido = false;
        } else {
            mostrarErro('descricaoCursoEmp', 'descricaoCursoEmpError', false);
        }
        
        // Valida carga horária
        if (!cargaHoraria) {
            mostrarErro('cargaHorariaCursoEmp', 'cargaHorariaCursoEmpError');
            valido = false;
        } else {
            mostrarErro('cargaHorariaCursoEmp', 'cargaHorariaCursoEmpError', false);
        }
        
        // Valida data de início
        if (!dataInicio) {
            mostrarErro('dataInicioCursoEmp', 'dataInicioCursoEmpError');
            valido = false;
        } else {
            mostrarErro('dataInicioCursoEmp', 'dataInicioCursoEmpError', false);
        }
        
        // Valida contato
        if (!contato) {
            mostrarErro('contatoPublicacaoEmp', 'contatoPublicacaoEmpError');
            valido = false;
        } else {
            mostrarErro('contatoPublicacaoEmp', 'contatoPublicacaoEmpError', false);
        }
        
        if (valido) {
            mostrarNotificacao('✓ Curso publicado com sucesso! Em breve aparecerá na plataforma. 📚', 'success');
            limparFormularioPublicacao();
        } else {
            mostrarNotificacao('⚠️ Por favor, preencha todos os campos obrigatórios.', 'error');
        }
    }
}

/**
 * Limpa o formulário de publicação após envio bem-sucedido
 */
function limparFormularioPublicacao() {
    // Limpa campos de vaga
    document.getElementById('tituloVagaEmp').value = '';
    document.getElementById('nomeEmpresaEmp').value = '';
    document.getElementById('descricaoVagaEmp').value = '';
    document.getElementById('localizacaoVagaEmp').value = '';
    document.getElementById('salarioVagaEmp').value = '';
    document.getElementById('requisitosVagaEmp').value = '';
    document.getElementById('beneficiosVagaEmp').value = '';
    
    // Limpa campos de curso
    document.getElementById('nomeCursoEmp').value = '';
    document.getElementById('instituicaoCursoEmp').value = '';
    document.getElementById('descricaoCursoEmp').value = '';
    document.getElementById('cargaHorariaCursoEmp').value = '';
    document.getElementById('dataInicioCursoEmp').value = '';
    document.getElementById('horarioCursoEmp').value = '';
    document.getElementById('vagasCursoEmp').value = '';
    document.getElementById('requisitosCursoEmp').value = '';
    
    // Limpa contato
    document.getElementById('contatoPublicacaoEmp').value = '';
    
    // Remove erros
    limparErros();
}

/**
 * Edita uma publicação existente
 * @param {number} idPublicacao - ID da publicação a ser editada
 */
function editarPublicacao(idPublicacao) {
    mostrarNotificacao(`Abrindo editor para a publicação #${idPublicacao}... ✏️`, 'success');
    
    // Navega para a seção de publicar
    mostrarSecaoEmpregador('publicar-emp');
    
    // Aqui você pode preencher o formulário com os dados da publicação
    // (simulação - em produção, buscaria os dados do banco)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Exclui uma publicação
 * @param {number} idPublicacao - ID da publicação a ser excluída
 */
function excluirPublicacao(idPublicacao) {
    if (confirm('⚠️ Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita.')) {
        mostrarNotificacao(`Publicação #${idPublicacao} excluída com sucesso! 🗑️`, 'success');
        
        // Remove o card visualmente (simulação)
        const vagaCard = event.target.closest('.vaga-emp-item');
        if (vagaCard) {
            vagaCard.style.transition = 'opacity 0.3s, transform 0.3s';
            vagaCard.style.opacity = '0';
            vagaCard.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                vagaCard.remove();
            }, 300);
        }
    }
}

/**
 * Exibe os candidatos de uma vaga específica
 * @param {number} idVaga - ID da vaga
 */
function verCandidatosVaga(idVaga) {
    // Navega para a seção de candidatos
    mostrarSecaoEmpregador('candidatos-emp');
    
    // Exibe candidatos exemplo (simulação)
    const listaCandidatos = document.getElementById('listaCandidatosEmp');
    
    listaCandidatos.innerHTML = `
        <h3 style="color: #020659; margin-bottom: 1.5rem;">Candidatos da Vaga #${idVaga}</h3>
        
        <div class="candidato-card">
            <div class="candidato-header">
                <div class="candidato-info">
                    <h4>👤 Maria Silva</h4>
                    <p> maria.silva@email.com</p>
                    <p> (83) 99999-8888</p>
                    <p> Área: Desenvolvimento Web</p>
                    <p> Nível: Intermediário</p>
                </div>
                <button class="btn-visualizar" onclick="visualizarCandidato(1)">
                     Ver Perfil Completo
                </button>
            </div>
            <p style="margin-top: 1rem; color: #666;">
                <strong>Candidatou-se em:</strong> 14/11/2025 às 10:30
            </p>
        </div>
        
        <div class="candidato-card">
            <div class="candidato-header">
                <div class="candidato-info">
                    <h4>👤 Ana Costa</h4>
                    <p> ana.costa@email.com</p>
                    <p> (83) 98888-7777</p>
                    <p> Área: Desenvolvimento Web</p>
                    <p> Nível: Iniciante</p>
                </div>
                <button class="btn-visualizar" onclick="visualizarCandidato(2)">
                     Ver Perfil Completo
                </button>
            </div>
            <p style="margin-top: 1rem; color: #666;">
                <strong>Candidatou-se em:</strong> 13/11/2025 às 15:45
            </p>
        </div>
        
        <div class="candidato-card">
            <div class="candidato-header">
                <div class="candidato-info">
                    <h4>👤 Julia Santos</h4>
                    <p> julia.santos@email.com</p>
                    <p> (83) 97777-6666</p>
                    <p> Área: UX/UI Design</p>
                    <p> Nível: Avançado</p>
                </div>
                <button class="btn-visualizar" onclick="visualizarCandidato(3)">
                     Ver Perfil Completo
                </button>
            </div>
            <p style="margin-top: 1rem; color: #666;">
                <strong>Candidatou-se em:</strong> 12/11/2025 às 09:20
            </p>
        </div>
    `;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Visualiza o perfil completo de um candidato
 * @param {number} idCandidato - ID do candidato
 */
function visualizarCandidato(idCandidato) {
    mostrarNotificacao(`Abrindo perfil completo do candidato #${idCandidato}... 👁️`, 'success');
    
    // Aqui você implementaria a visualização do perfil completo
    // Por exemplo, abrir um modal ou redirecionar para uma página de detalhes
}

/**
 * Salva as alterações do perfil do empregador
 */
function salvarPerfilEmpregador() {
    const nome = document.getElementById('nomePerfilEmp').value.trim();
    const email = document.getElementById('emailPerfilEmp').value.trim();
    const telefone = document.getElementById('telefonePerfilEmp').value.trim();
    
    if (!nome || !email || !telefone) {
        mostrarNotificacao('⚠️ Por favor, preencha os campos obrigatórios (Nome, E-mail e Telefone).', 'error');
        return;
    }
    
    mostrarNotificacao('✓ Perfil atualizado com sucesso! 💾', 'success');
}

/**
 * IMPORTANTE: SUBSTITUA a função entrarPlataforma EXISTENTE por esta versão atualizada
 * Modifica a função entrarPlataforma para suportar empregador
 */
function entrarPlataforma() {
    const nome = usuarioNome || 'Usuário';
    
    // Esconde tela de login e exibe plataforma
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPlatform').style.display = 'block';
    
    // Verifica o tipo de usuário e exibe o dashboard apropriado
    if (usuarioTipo === 'empregador') {
        // Esconde o conteúdo padrão e exibe dashboard do empregador
        document.querySelector('.content').style.display = 'none';
        document.getElementById('empregadorDashboard').classList.add('active');
        
        // Exibe notificação de boas-vindas
        mostrarNotificacao(`Bem-vindo, ${nome}! Gerencie suas vagas e cursos. 💼`, 'success');
        
    } else {
        // Exibe conteúdo padrão para usuária
        document.querySelector('.content').style.display = 'block';
        document.getElementById('empregadorDashboard').classList.remove('active');
        
        // Exibe notificação de boas-vindas
        mostrarNotificacao(`Bem-vinda, ${nome}! 💜`, 'success');
    }
}

/**
 * IMPORTANTE: SUBSTITUA a função sair EXISTENTE por esta versão atualizada
 * Modifica a função sair para resetar também o dashboard do empregador
 */
function sair() {
    if (confirm('Deseja realmente sair?')) {
        // Esconde plataforma e exibe tela de login
        document.getElementById('mainPlatform').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        
        // Reseta displays
        document.querySelector('.content').style.display = 'block';
        document.getElementById('empregadorDashboard').classList.remove('active');
        
        // Reseta todos os formulários para estado inicial
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('cadastroForm').classList.add('hidden');
        document.getElementById('tipoUsuarioForm').classList.add('hidden');
        document.getElementById('dadosUsuariaForm').classList.add('hidden');
        document.getElementById('dadosEmpregadorForm').classList.add('hidden');
        
        // Limpa variáveis
        usuarioTipo = '';
        usuarioNome = '';
        usuarioEmail = '';
        
        // Limpa erros
        limparErros();
        
        // Exibe mensagem de despedida
        mostrarNotificacao('Até breve! 👋', 'success');
    }
}

/* ==================== FIM DAS FUNÇÕES DO EMPREGADOR ==================== */

/**
 * Volta para o menu inicial do dashboard do empregador
 * Esconde todas as seções e mostra novamente o menu de navegação
 */
function voltarMenuEmpregador() {
    // Esconde todas as seções
    document.querySelectorAll('.content-section-emp').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active de todos os botões
    document.querySelectorAll('.nav-btn-emp').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ativa a primeira seção (Pedidos) como padrão
    document.getElementById('pedidos-emp').classList.add('active');
    document.querySelector('.nav-btn-emp').classList.add('active');
    
    // Rola suavemente para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    mostrarNotificacao('Voltando ao menu principal... 📋', 'success');
}

/* ==================== FIM DO CÓDIGO JAVASCRIPT ==================== */