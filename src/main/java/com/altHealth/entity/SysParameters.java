package com.altHealth.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tblSysParameters")
public class SysParameters {
	
	@Id
	Integer id;

	@Column(name = "VAT_Percent")
	Integer vatPercent;
	@Column
	String email;
	@Column
	String emailPass;
	@Column
	String address;
	@Column
	String telNo;

	public SysParameters() {
	}
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getVatPercent() {
		return vatPercent;
	}

	public void setVatPercent(Integer vatPercent) {
		this.vatPercent = vatPercent;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmailPass() {
		return emailPass;
	}

	public void setEmailPass(String emailPass) {
		this.emailPass = emailPass;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getTelNo() {
		return telNo;
	}

	public void setTelNo(String telNo) {
		this.telNo = telNo;
	}

	@Override
	public String toString() {
		return "SysParameters [id=" + id + ", vatPercent=" + vatPercent + ", email=" + email + ", emailPass="
				+ emailPass + ", address=" + address + ", telNo=" + telNo + "]";
	}

}
