import { mostraralertas } from "@/assets/js/function/funciones";
import { enviarsolilogin } from "@/assets/js/function/login_function";
import store from "@/store";
import { getMe } from '@/store/auth';
export default {
  data() {
    return {
      email: "",
      password: "",
      url2: `${__API_BIOMETRICO__}/biometrico/login`,
      isLoggingIn: false
    };
  },
  methods: {
    async login() {
      if (this.isLoggingIn) return;
      try {
        this.isLoggingIn = true;
        var parametros = {
          LoginUsu: this.email.trim(),
          ClaveUsu: this.password.trim(),
        };

        const response = await enviarsolilogin('POST', parametros, this.url2, 'Logueado');

        if (response.error) {
          mostraralertas(response.mensaje, 'warning');
          this.isLoggingIn = false;
        } else if (response) {
          
          const role = response.Rol;
          const tok = response.token;
          if (role === 'sotics' || role === 'atics' || role === 'sa') {
            mostraralertas('LE DAMOS LA BIENVENIDA ' + (response.name || ''), 'success');
            this.$router.push('/home');
          } 
        }
      } catch (error) {
        this.isLoggingIn = false;
        console.error("Error en login:", error);
        if (error.response?.data?.mensaje) {
          mostraralertas(error.response.data.mensaje, 'warning');
        } else {
          mostraralertas('No se pudo conectar con el servidor o error inesperado.', 'error');
        }
      }
    },
  },
};
