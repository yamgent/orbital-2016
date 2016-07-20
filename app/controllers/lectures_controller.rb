class LecturesController < ApplicationController
  before_action :set_lecture, only: [:edit, :update, :destroy]
  before_action :authorize_admin, :initUser

  # GET /lectures/new
  def new
    course_id = params[:course_id]
    if course_id.nil?
      course_id = Course.first.id
    end

    @edit_course = Course.find(course_id)
    @edit_lecture = Lecture.new
  end

  # GET /lectures/edit/1
  def edit
    @edit_course = Course.find(@edit_lecture.course_id)
  end

  # POST /lectures
  def create
    @edit_lecture = Lecture.new(lecture_params)
    @edit_course = Course.find(@edit_lecture.course_id);

  respond_to do |format|
    if @edit_lecture.save
      format.html { redirect_to @edit_course, notice: 'Lecture was successfully created.' }
      format.json { render :show, status: :created, location: @edit_course }
    else
      format.html { render :new }
      format.json { render json: @edit_lecture.errors, status: :unprocessable_entity }
    end
  end
  end

  # PATCH/PUT /courses/1
  def update
    @edit_course = Course.find(@edit_lecture.course_id);

    respond_to do |format|
      if @edit_lecture.update(lecture_params)
        format.html { redirect_to @edit_course, notice: 'Lecture was successfully updated.' }
        format.json { render :show, status: :ok, location: @edit_course }
      else
        format.html { render :edit }
        format.json { render json: @edit_lecture.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lectures/1
  def destroy
    @edit_course = Course.find(@edit_lecture.course_id);

    @edit_lecture.destroy
    respond_to do |format|
      format.html { redirect_to @edit_course, notice: 'Leture was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lecture
      @edit_lecture = Lecture.find(params[:id])
    end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def lecture_params
      params.require(:lecture).permit(:course_id, :day, :start_time, :end_time, :group_number)
    end
end
