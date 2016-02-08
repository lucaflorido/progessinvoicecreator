package it.progess.invoicecreator.service;

import it.progess.connector.service.ProgessConnector;
import it.progess.connector.service.vo.ProgessRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;

@Path("connector")
public class Connector {
	private Gson gson = new Gson();
	@GET
	public String doGet(){
		return ProgessConnector.doGet();
	}
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPost(String data){
		ProgessRequest pr = gson.fromJson(data, ProgessRequest.class);
		return ProgessConnector.doPost(pr);
	}
}
