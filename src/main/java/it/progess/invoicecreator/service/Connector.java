package it.progess.invoicecreator.service;

import it.progess.connector.service.ProgessConnector;
import it.progess.connector.service.vo.ProgessRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.cxf.transport.http.HttpServletRequestSnapshot;

import com.google.gson.Gson;

@Path("connector")
public class Connector {
	private Gson gson = new Gson();
	private String key = "";
	
	@GET
	@Path("{method}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doGet(String data,@PathParam("method") String method,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {};
		return callDoGet( method,request.getSession(),uuid,ar);
	}
	@GET
	@Path("{method}/{param1}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doGet(String data,@PathParam("method") String method,@PathParam("param1") String param1,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1};
		return callDoGet( method,request.getSession(),uuid,ar);
	}
	
	@GET
	@Path("{method}/{param1}/{param2}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doGet(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2};
		return callDoGet( method,request.getSession(),uuid,ar);
	}
	@GET
	@Path("{method}/{param1}/{param2}/{param3}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doGet(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@PathParam("param3") String param3,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2,param3};
		return callDoGet( method,request.getSession(),uuid,ar);
	}
	
	
	
	
	@POST
	@Path("{method}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPost(String data,@PathParam("method") String method,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {};
		return callDoPost(data, method,request.getSession(),uuid,ar);
	}
	@POST
	@Path("{method}/{param1}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPost(String data,@PathParam("method") String method,@PathParam("param1") String param1,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1};
		return callDoPost(data, method,request.getSession(),uuid,ar);
	}
	@POST
	@Path("{method}/{param1}/{param2}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPost(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2};
		return callDoPost(data, method,request.getSession(),uuid,ar);
	}
	@POST
	@Path("{method}/{param1}/{param2}/{param3}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPost(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@PathParam("param3") String param3,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2,param3};
		return callDoPost(data, method,request.getSession(),uuid,ar);
	}
	
	
	
	
	
	
	
	@PUT
	@Path("{method}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPut(String data,@PathParam("method") String method,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {};
		return callDoPut(data, method,request.getSession(),uuid,ar);
	}
	@PUT
	@Path("{method}/{param1}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPut(String data,@PathParam("method") String method,@PathParam("param1") String param1,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1};
		return callDoPut(data, method,request.getSession(),uuid,ar);
	}
	@PUT
	@Path("{method}/{param1}/{param2}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPut(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2};
		return callDoPut(data, method,request.getSession(),uuid,ar);
	}
	@PUT
	@Path("{method}/{param1}/{param2}/{param3}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doPut(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@PathParam("param3") String param3,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2,param3};
		return callDoPut(data, method,request.getSession(),uuid,ar);
	}
	
	
	
	@DELETE
	@Path("{method}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doDelete(String data,@PathParam("method") String method,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {};
		return callDoDelete(data, method,request.getSession(),uuid,ar);
	}
	@DELETE
	@Path("{method}/{param1}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doDelete(String data,@PathParam("method") String method,@PathParam("param1") String param1,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1};
		return callDoDelete(data, method,request.getSession(),uuid,ar);
	}
	@DELETE
	@Path("{method}/{param1}/{param2}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doDelete(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2};
		return callDoDelete(data, method,request.getSession(),uuid,ar);
	}
	@DELETE
	@Path("{method}/{param1}/{param2}/{param3}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String doDelete(String data,@PathParam("method") String method,@PathParam("param1") String param1,@PathParam("param2") String param2,@PathParam("param3") String param3,@Context HttpServletRequest request,@HeaderParam("AuthKey") String uuid){
		String[] ar = {param1,param2,param3};
		return callDoDelete(data, method,request.getSession(),uuid,ar);
	}
	
	@POST
	@Path("session/user")
	@Produces(MediaType.APPLICATION_JSON)
	public String getUserKey(@Context HttpServletRequest request){
		String key = null;
		if(request.getSession().getAttribute("user-key") != null){
			key = request.getSession().getAttribute("user-key").toString();
		}
		return new Gson().toJson(key);
	}
	@POST
	@Path("session/user/{authkey}")
	@Produces(MediaType.APPLICATION_JSON)
	public void getUserKey(@Context HttpServletRequest request,@PathParam("authkey") String authkey){
		request.setAttribute("user-key", authkey);
	}
	private String callDoPost(String data, String method,HttpSession session,String authkey,String[] params){
		ProgessRequest pr = new ProgessRequest(); //gson.fromJson(data, ProgessRequest.class);
		pr.setPayload(data);
		pr.setUrlcode(method);
		session.setAttribute("user-key", authkey);
		return ProgessConnector.doPost(pr,session,authkey,params);
	}
	private String callDoGet(String method,HttpSession session,String authkey,String[] params){
		ProgessRequest pr = new ProgessRequest();
		pr.setUrlcode(method);
		session.setAttribute("user-key", authkey);
		return ProgessConnector.doGet(pr,session,authkey,params);
	}
	private String callDoPut(String data, String method,HttpSession session,String authkey,String[] params){
		ProgessRequest pr = new ProgessRequest();
		pr.setPayload(data);
		pr.setUrlcode(method);
		session.setAttribute("user-key", authkey);
		return ProgessConnector.doPut(pr,session,authkey,params);
	}
	private String callDoDelete(String data, String method,HttpSession session,String authkey,String[] params){
		ProgessRequest pr = new ProgessRequest();
		pr.setPayload(data);
		pr.setUrlcode(method);
		session.setAttribute("user-key", authkey);
		return ProgessConnector.doDelete(pr,session,authkey,params);
	}
}
