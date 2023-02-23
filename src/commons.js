
import { trackPromise } from 'react-promise-tracker';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function getAuthorizationHeader(email, password) {
	console.log("getAuthorizationHeader - START - email: " + email + " - password: " + password);
	let authdata = getAuthorizationToken(email, password);
	console.log("###" + authdata + "###");
	return { 'Authorization': 'Basic ' + authdata };
}
export function getAuthorizationToken(email, password) {
	console.log("getAuthorizationToken - START - email: " + email + " - password: " + password);
	let authdata = window.btoa(email + ':' + password);
	console.log("###" + authdata + "###");
	return authdata;
}
export function getAuthorizationHeaderFromToken(token, isBodyAJSON) {
	let authToken = null;
	if (isBodyAJSON !== null && isBodyAJSON) {
		authToken = {
			'Authorization': 'Basic ' + token,
			'Content-Type': 'application/json'
		};
	} else {
		authToken = {
			'Authorization': 'Basic ' + token
		};
	}
	console.log("getAuthorizationHeader - START - authToken: " + authToken);
	return authToken;
}

export function getUserLoggedId() {
	console.log("Commons.getUserLoggedId - START");
	let userId = sessionStorage.getItem('userId');
	return userId;

}

export function executeDelete(uri, successCallbackFunction, callbackFunctionKO) {
	console.log("Commons.executeDelete - START - uri: " + uri);
	let token = sessionStorage.getItem('headerToken');
	let headerToken = getAuthorizationHeaderFromToken(token);

	trackPromise(
		fetch(uri, {
			method: 'DELETE',
			headers: headerToken
		})
			//   .then((response) => {
			//.then(response => response.json()
			//.then(response => response.then(response => (response.status===204?{ status: response.status, body: "sticazzi" }:{ status: response.status, body: "stimazzi" }))
			.then(response => response
				)
			.then((response) => {
				console.log("Commons.executeDelete - DEBUG - response: " + response);
				console.log(response.status);
				// console.log(response);
				 if (response.status === 204) {
				 	successCallbackFunction();
				// 	//   } else if (data.status===200||data.status===201) {
				// 	// 		  successCallbackFunction(data.body);
				 } else {//ERROR
				 	callbackFunctionKO(response);
				 }
			})
	)
}

export function executeFetch(uri, method, successCallbackFunction, callbackFunctionKO, body, isBodyAJSON) {
	console.log("Commons.executeFetch - START - uri: " + uri);
	let token = sessionStorage.getItem('headerToken');
	// let headerToken = null ;
	// if (isBodyAJSON!==null && isBodyAJSON) {
	let headerToken = getAuthorizationHeaderFromToken(token, isBodyAJSON);
	// } else {
	// headerToken = getAuthorizationHeaderFromToken(token);
	// }
	executeFetchWithHeader(uri, method, headerToken, successCallbackFunction, callbackFunctionKO, body)

}

export function executeFetchWithHeader(uri, method, headerToken, successCallbackFunction, callbackFunctionKO, body) {
	console.log("Commons.executeFetchWithHeader - START - uri: " + uri);
	console.log(`Commons.executeFetchWithHeader - DEBUG - body: ${body}`);
	console.log(body);
	console.log(`Commons.executeFetchWithHeader - DEBUG - method: ${method}  - uri: ${uri}`);
	trackPromise(
		fetch(uri, {
			method: method,
			body: body,

			headers: headerToken
		})
			//   .then((response) => {
			.then(
				r => r.json().then(data => ({ status: r.status, body: data }))
			)
			//   console.log(response);
			// //   if (method==="POST" && response.status===201) {
			// // 	  successCallbackFunction(response);
			// //   } else if (response.status===200) {
			// // 	  successCallbackFunction(response.json());
			// //   } else {//ERROR
			// // 	callbackFunctionKO();
			// //   }
			// //   if(!response.ok) {
			// // 	  console.warn(response.status); // Will show you the status
			// // 	  //throw new Error(response.status);
			// //   } else if (method==="DELETE") {
			// // 	  return "" ;
			// //   } else return response.json();
			// let responseData = response.json() 
			// //   return response.json();
			// return (responseData) ;
			//     //   if (method==="POST" && response.status===201) {
			// 	// 	  successCallbackFunction(responseData);
			// 	//   } else if (response.status===200) {
			// 	// 	  successCallbackFunction(responseData);
			// 	//   } else {//ERROR
			// 	// 	callbackFunctionKO(responseData);
			// 	//   }
			//   })
			.then((data) => {
				console.log("Commons.executeFetchWithHeader - DEBUG - data: " + data);
				if (method == 'DELETE' && data.status === 204) {
					successCallbackFunction(data.body);
				} else if (data.status === 200 || data.status === 201) {
					successCallbackFunction(data.body);
				} else {//ERROR
					callbackFunctionKO(data.body);
				}
				//   if (data!==undefined) {
				// 	successCallbackFunction(data);
				//   } else {
				// 	  callbackFunctionKO(data);
				//   }
			})
	);
}

export function operationError(err) {
	console.log("OPERATION KO");
	toast.error(err.errorMessage, {
		position: toast.POSITION.BOTTOM_LEFT
	});
	console.error(err)
}

const DEBUG_ENABLED = true;
const INFO_ENABLED = true;

export function infoMessage(message) {
	if (INFO_ENABLED) {
		console.info(message);
	}
}
export function debugMessage(message) {
	if (DEBUG_ENABLED) {
		console.log(message);
	}
}