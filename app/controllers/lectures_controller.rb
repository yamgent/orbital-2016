class LecturesController < ApplicationController
  before_action :authorize_admin, :initUser

  # GET /lectures/new
  def new
  end

  # GET /lectures/edit/1
  def edit
  end

  # POST /lectures
  def create
  end

  # PATCH/PUT /courses/1
  def update
  end

  # DELETE /lectures/1
  def destroy
  end
end
