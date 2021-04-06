var app = angular.module('App',[]);
app.controller('nuevo-Controller', function($scope){
	$scope.listGasolina = [];
	

	$scope.Gasolina = {
        Id: 0,
        Fecha: "",
        Kilometraje: "",
        TipoGasolina: {
			Id: 1,
        },
        Litros: "",
        Pago: "",
    };

    $scope.ListTipoGasolina = [];

    $scope.oGasolina = angular.copy($scope.Gasolina);

    $scope.Limpiar = function () {
        $scope.oGasolina = angular.copy($scope.Gasolina);
    };
	
	$scope.Save = function(){

		if( $scope.oGasolina.Kilometraje != "" 
			&& $scope.oGasolina.Kilometraje != ""
			&& $scope.oGasolina.Litros != ""
			&& $scope.oGasolina.Pago != ""
			&& $scope.oGasolina.Fecha != "" ){
			$scope.db.transaction($scope.SaveGasolina,$scope.error,$scope.SuccessTR);
			$scope.Leer();
		}
		else{
			showModalMessage('#modalSuccess', 'Verifique Informacion Suministrada');
		}
		
	}

	$scope.SaveGasolina = function(tx){
		var sql = "INSERT INTO Gasolina (fecha,kilometraje,tipoGasolina,litros,pago) VALUES ('"+ $scope.oGasolina.Fecha +"',"+ $scope.oGasolina.Kilometraje +","+ $scope.oGasolina.TipoGasolina.Id +","+ $scope.oGasolina.Litros +","+ $scope.oGasolina.Pago +")";
	   	tx.executeSql(sql);

	   	showModalMessage('#modalSuccess', 'Registro Agregado Correctamente');

	   	$scope.Limpiar();
	}

	 $scope.Leer = function(){
		$scope.db.transaction($scope.LeerGasolina,$scope.error,$scope.SuccessTR);
		$scope.db.transaction($scope.LeerTiposGaslina,$scope.error,$scope.SuccessTR);
	}

	$scope.LeerGasolina = function(tx){
		
		var sql = "SELECT Gasolina.id,fecha,kilometraje,TipoGasolina.Id as Id_Gas,TipoGasolina.Nombre,litros,pago FROM Gasolina INNER JOIN TipoGasolina ON Gasolina.tipoGasolina = TipoGasolina.Id";
	   	tx.executeSql(sql,[],$scope.cargarGasolina,$scope.Error);
		
	}

	$scope.LeerTiposGaslina = function(tx){
		
		var sql = "SELECT Id, Nombre FROM TipoGasolina";
	   	tx.executeSql(sql,[],$scope.cargarTipoGasolina,$scope.Error);
		
	}

	$scope.cargarTipoGasolina = function(tr,resultados){
		var largo = resultados.rows.length;

		$scope.ListTipoGasolina = [];

	    for (var i=0; i<largo; i++){
	        var tipoGasolina = angular.copy($scope.Gasolina);

		    tipoGasolina.Id = resultados.rows.item(i).id;
		    tipoGasolina.Nombre = resultados.rows.item(i).Nombre;

			$scope.$apply(function(){
				$scope.ListTipoGasolina.push(tipoGasolina);
	        });
			
		}
	}
	
	$scope.cargarGasolina = function(tr,resultados){
		var largo = resultados.rows.length;

	    for (var i=0; i<largo; i++){
	        var gasolina = angular.copy($scope.Gasolina);

		    gasolina.Id = resultados.rows.item(i).id;
		    gasolina.Fecha = resultados.rows.item(i).fecha;
		    gasolina.Kilometraje = resultados.rows.item(i).kilometraje;
		    gasolina.TipoGasolina.Id = resultados.rows.item(i).Id_Gas;
		    gasolina.TipoGasolina.Nombre = resultados.rows.item(i).Nombre;
		    gasolina.Litros = resultados.rows.item(i).litros;
		    gasolina.Pago = resultados.rows.item(i).pago;
			
		    $scope.listGasolina.push(gasolina);
			
			
		}

		$scope.$apply(function(){
			$scope.listGasolinaDisplay = [].concat($scope.listGasolina);
        });	
	}

	$scope.CreateDatabase = function(){
	    $scope.db = openDatabase('4gl','1.0','RegistroGasolina',1000000);
	    $scope.db.transaction($scope.createtable,$scope.error,$scope.SuccessTR);
		$scope.Leer();
	}

	$scope.createtable = function(tx){
		//tx.executeSql('DROP TABLE TipoGasolina',[],$scope.SuccessSQL,$scope.Error);
		//tx.executeSql('DROP TABLE Gasolina',[],$scope.SuccessSQL,$scope.Error);
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS Gasolina (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,fecha Text,kilometraje Text,tipoGasolina INTEGER,litros Text,pago Text)',[],$scope.SuccessSQL,$scope.Error);
		tx.executeSql('CREATE TABLE IF NOT EXISTS TipoGasolina (id INTEGER NOT NULL PRIMARY KEY,Nombre Text)',[],$scope.SuccessSQL,$scope.Error);

		var sql = "INSERT INTO TipoGasolina (id,Nombre) VALUES (1,'Super')";
	   	tx.executeSql(sql);

	   	var sql = "INSERT INTO TipoGasolina (id,Nombre) VALUES (2,'Regular')";
	   	tx.executeSql(sql);

	   	var sql = "INSERT INTO TipoGasolina (id,Nombre) VALUES (3,'Disel')";
	   	tx.executeSql(sql);
	}

    $scope.SuccessTR = function(){
		console.log('succes Transaction');
	}

	$scope.SuccessSQL = function(){
		console.log('succes SQL');
	}

	$scope.Error =	function(tx, err){
		console.log('Error: '+ err.code+' : '+err.message );
	}

    $scope.CreateDatabase();

    $scope.Gasolina.TipoGasolina.Id = '1';

    function showModalMessage (modal, message) {
	    $(modal + 'Message').text(message);
	    $(modal).modal('show');
	};

	$(function () {
	    $('#modalSuccess').on('show.bs.modal', function () {
	        var modalSuccess = $(this);
	        clearTimeout(modalSuccess.data('hideInterval'));
	        modalSuccess.data('hideInterval', setTimeout(function () {
	            modalSuccess.modal('hide');
	        }, 2000));
	    });
	});

    

}); 